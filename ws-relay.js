// Minimal WebSocket relay to sync chat across different ports/origins in dev
// Usage: node ws-relay.js (starts ws://localhost:3001)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WebSocketServer } = require('ws');

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : 3001;
const wss = new WebSocketServer({ port: PORT });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    // broadcast to everyone else
    for (const client of clients) {
      if (client !== ws && client.readyState === 1) {
        try {
          client.send(JSON.stringify(msg));
        } catch {}
      }
    }
  });
  ws.on('close', () => clients.delete(ws));
});

console.log(`✅ WS relay listening on ws://localhost:${PORT}`);
