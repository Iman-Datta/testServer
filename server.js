const express = require("express");
const os = require("os");

const app = express();
const PORT = 3000;

const startTime = Date.now();

function getUptime() {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Test Server</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Courier New', monospace; background: #0d0d0d; color: #e0e0e0; min-height: 100vh; display: flex; flex-direction: column; }
        .hero { padding: 3rem 2rem 2rem; border-bottom: 1px solid #222; }
        .pill { display: inline-flex; align-items: center; gap: 6px; background: #0f2a1a; color: #4ade80; font-size: 12px; padding: 4px 12px; border-radius: 999px; margin-bottom: 1.5rem; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        h1 { font-size: 2rem; font-weight: 500; color: #fff; letter-spacing: -0.5px; margin-bottom: 0.5rem; }
        .subtitle { font-size: 14px; color: #888; line-height: 1.6; max-width: 500px; font-family: -apple-system, sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #222; border-bottom: 1px solid #222; }
        .stat { background: #0d0d0d; padding: 1.25rem 1.5rem; }
        .stat-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; font-family: sans-serif; }
        .stat-value { font-size: 18px; font-weight: 500; color: #fff; }
        .section { padding: 1.5rem 2rem; border-bottom: 1px solid #222; }
        .sec-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; font-family: sans-serif; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { font-size: 13px; color: #aaa; background: #111; border: 1px solid #222; padding: 4px 12px; border-radius: 6px; }
        .route { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; }
        .route:last-child { border-bottom: none; }
        .method { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; background: #0a1f3a; color: #60a5fa; min-width: 40px; text-align: center; }
        .path { color: #fff; }
        .desc { color: #555; margin-left: auto; font-family: sans-serif; font-size: 12px; }
        .footer { margin-top: auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; }
        .footer-text { font-size: 12px; color: #444; font-family: sans-serif; }
      </style>
    </head>
    <body>
      <div class="hero">
        <div class="pill"><span class="dot"></span> online</div>
        <h1>Iman Datta</h1>
        <p class="subtitle">Self-hosted on Debian Linux — Intel Core i5 (8th Gen) mini PC. Reverse proxied through Nginx with HTTPS via Let's Encrypt.</p>
      </div>

      <div class="grid">
        <div class="stat"><div class="stat-label">host</div><div class="stat-value">Debian</div></div>
        <div class="stat"><div class="stat-label">runtime</div><div class="stat-value">Node.js</div></div>
        <div class="stat"><div class="stat-label">proxy</div><div class="stat-value">Nginx</div></div>
        <div class="stat"><div class="stat-label">uptime</div><div class="stat-value">${getUptime()}</div></div>
      </div>

      <div class="section">
        <div class="sec-label">stack</div>
        <div class="tags">
          <span class="tag">linux</span>
          <span class="tag">nginx</span>
          <span class="tag">node.js</span>
          <span class="tag">certbot</span>
          <span class="tag">ssh</span>
          <span class="tag">port-forwarding</span>
        </div>
      </div>

      <div class="section">
        <div class="sec-label">endpoints</div>
        <div class="route"><span class="method">GET</span><span class="path">/</span><span class="desc">this page</span></div>
        <div class="route"><span class="method">GET</span><span class="path">/health</span><span class="desc">health check</span></div>
        <div class="route"><span class="method">GET</span><span class="path">/info</span><span class="desc">runtime info (json)</span></div>
      </div>

      <div class="footer">
        <span class="footer-text">built by iman datta · kolkata</span>
        <span class="footer-text">${new Date().toUTCString()}</span>
      </div>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: getUptime() });
});

app.get("/info", (req, res) => {
  res.json({
    host: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    uptime: getUptime(),
    memory: {
      total: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      free: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
    },
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
