import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DEV_PIN = 'pipo2026'; // الرمز السري مخزن في السيرفر فقط ومحمي 100%

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'database.json');

// التحقق من PIN المطور وحمايته
app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === DEV_PIN) {
    const adminToken = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return res.json({ success: true, token: adminToken });
  }
  return res.status(401).json({ success: false, error: 'رمز المرور غير صحيح' });
});

// تشغيل السيرفر ودمج Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PIPO System running at http://localhost:${PORT}`);
  });
}

startServer();
