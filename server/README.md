AalaNiroo Backend (Express + Prisma)

1) Prerequisites
- Node.js 18+
- PostgreSQL 14+

2) Setup
- Copy server/.env.example to server/.env and fill values (DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT, SUPERADMIN_*).
- From server/ run:
```
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run start
```
- API health: GET http://localhost:4000/api/health

3) Endpoints
- POST /api/auth/login { email, password }
- GET /api/users (roles: superadmin, admin)
- POST /api/users (role: superadmin)
- PATCH /api/users/:id (role: superadmin)
- DELETE /api/users/:id (role: superadmin)
- GET /api/audit-logs (role: superadmin)

4) Deployment (PM2 + Nginx)
- Install pm2 globally: `npm i -g pm2`
- Start: `pm2 start src/index.js --name aala-api`
- Persist: `pm2 save && pm2 startup`
- Nginx reverse proxy sample:
```
server {
  listen 80;
  server_name api.test.aalaniroo.com;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
- Enable HTTPS via certbot.

5) Frontend Integration
- Set VITE_API_BASE_URL to `https://api.test.aalaniroo.com`.
- Frontend will use remote auth if this env var is set (to be wired).
