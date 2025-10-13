require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function randomHex(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}
async function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const pwd = Buffer.from(password);
  const combined = Buffer.concat([salt, pwd]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

(async () => {
  const email = (process.env.SUPERADMIN_EMAIL || 'root@aalaniroo.com').toLowerCase();
  const name = process.env.SUPERADMIN_NAME || 'Super Admin';
  const plain = process.env.SUPERADMIN_PASSWORD || 'ChangeMe!234';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('Superadmin already exists. Skipping.');
    process.exit(0);
  }

  const salt = randomHex(16);
  const password = await hashPassword(plain, salt);
  const user = await prisma.user.create({ data: { email, name, role: 'superadmin', status: 'active', salt, password } });
  console.log('Superadmin created:', user.email);
  process.exit(0);
})();
