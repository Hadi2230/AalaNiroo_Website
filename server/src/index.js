require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function sha256Hex(input) {
  const crypto = await import('node:crypto');
  return crypto.createHash('sha256').update(input).digest('hex');
}
function randomHex(bytes = 16) {
  const crypto = require('crypto');
  return crypto.randomBytes(bytes).toString('hex');
}
async function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const pwd = Buffer.from(password);
  const combined = Buffer.concat([salt, pwd]);
  return sha256Hex(combined);
}

function sign(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!u || u.status !== 'active') return res.status(401).json({ error: 'invalid_credentials' });
  const hash = await hashPassword(password.trim(), u.salt);
  if (hash !== u.password) return res.status(401).json({ error: 'invalid_credentials' });
  await prisma.user.update({ where: { id: u.id }, data: { lastLogin: new Date() } });
  await prisma.auditLog.create({ data: { actorId: u.id, action: 'login', target: u.email, metadata: {}, userAgent: req.headers['user-agent'] } });
  const token = sign(u);
  return res.json({ token, user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, status: u.status, lastLogin: u.lastLogin } });
});

// Users CRUD (superadmin + admin for list; superadmin for write)
app.get('/api/users', auth, requireRole(['superadmin', 'admin']), async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users.map(({ password, salt, ...u }) => u));
});
app.post('/api/users', auth, requireRole(['superadmin']), async (req, res) => {
  const { name, email, role = 'manager', status = 'active', avatar, password: plain, grants = [], denies = [] } = req.body;
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return res.status(409).json({ error: 'email_exists' });
  const salt = randomHex(16);
  const password = await hashPassword(plain, salt);
  const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), role, status, avatar, password, salt, grants, denies } });
  await prisma.auditLog.create({ data: { actorId: req.user.sub, action: 'user.create', target: user.id, metadata: { role } } });
  res.status(201).json({ id: user.id });
});
app.patch('/api/users/:id', auth, requireRole(['superadmin']), async (req, res) => {
  const { id } = req.params;
  const { name, role, status, avatar, grants, denies, password: newPassword } = req.body;
  const data = { name, role, status, avatar, grants, denies };
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);
  if (newPassword) {
    const salt = randomHex(16);
    data.salt = salt;
    data.password = await hashPassword(newPassword, salt);
  }
  const user = await prisma.user.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorId: req.user.sub, action: 'user.update', target: id, metadata: data } });
  res.json({ ok: true });
});
app.delete('/api/users/:id', auth, requireRole(['superadmin']), async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorId: req.user.sub, action: 'user.delete', target: id } });
  res.json({ ok: true });
});

// Audit logs
app.get('/api/audit-logs', auth, requireRole(['superadmin']), async (req, res) => {
  const { q } = req.query;
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 1000, include: { actor: true } });
  const filtered = q ? logs.filter(l =>
    (l.actor?.email || '').includes(q) || (l.actor?.name || '').includes(q) || (l.action||'').includes(q) || (l.target||'').includes(q)
  ) : logs;
  res.json(filtered);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
