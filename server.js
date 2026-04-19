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
:root {
  --bg: #0b0b0c;
  --card: #111113;
  --text: #e5e5e5;
  --muted: #888;
  --accent: #22c55e;
  --border: #1f1f22;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height:100vh;
}

/* NAV */
.nav {
  display:flex;
  justify-content:space-between;
  padding:16px 24px;
  border-bottom:1px solid var(--border);
}

.logo { font-weight:700; }

.status {
  display:flex;
  align-items:center;
  gap:6px;
  font-size:12px;
  color:var(--accent);
}

.dot {
  width:6px;
  height:6px;
  background:var(--accent);
  border-radius:50%;
  animation:pulse 1.5s infinite;
}

@keyframes pulse {
  0%,100% { opacity:1; }
  50% { opacity:0.3; }
}

/* HERO */
.hero {
  padding:60px 24px 30px;
  max-width:900px;
}

.hero h1 {
  font-size: clamp(2rem,5vw,3rem);
  line-height:1.2;
}

.hero span {
  color: var(--muted);
}

.hero p {
  margin-top:12px;
  color: var(--muted);
  max-width:500px;
}

/* CARDS */
.grid {
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
  gap:16px;
  padding:20px 24px;
}

.card {
  background:var(--card);
  border:1px solid var(--border);
  border-radius:14px;
  padding:18px;
}

.label {
  font-size:11px;
  color:var(--muted);
  margin-bottom:6px;
}

.value {
  font-weight:700;
  font-size:15px;
}

/* STACK */
.tags {
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  padding:0 24px 20px;
}

.tag {
  padding:5px 10px;
  border-radius:6px;
  background:#161618;
  font-size:12px;
}

/* ENDPOINTS */
.section {
  padding:20px 24px;
}

.endpoint {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px;
  border:1px solid var(--border);
  border-radius:10px;
  margin-bottom:10px;
}

.method {
  color:#60a5fa;
  font-weight:700;
  font-size:12px;
}

.btn {
  font-size:12px;
  padding:4px 10px;
  border-radius:6px;
  border:1px solid var(--border);
  color:var(--muted);
  text-decoration:none;
}

.btn:hover {
  background:var(--text);
  color:#000;
}

/* FOOTER */
.footer {
  padding:20px;
  text-align:center;
  color:var(--muted);
  font-size:12px;
}

</style>
</head>

<body>

<div class="nav">
  <div class="logo">Iman Datta</div>
  <div class="status"><div class="dot"></div> online</div>
</div>

<div class="hero">
  <h1>Running on<br><span>bare metal.</span></h1>
  <p>No cloud. No managed platform. Just a machine on a desk.</p>
</div>

<div class="grid">
  <div class="card">
    <div class="label">OS</div>
    <div class="value">Debian</div>
  </div>
  <div class="card">
    <div class="label">Runtime</div>
    <div class="value">Node.js</div>
  </div>
  <div class="card">
    <div class="label">Proxy</div>
    <div class="value">Nginx</div>
  </div>
  <div class="card">
    <div class="label">Uptime</div>
    <div class="value" id="uptime">${getUptime()}</div>
  </div>
</div>

<div class="tags">
  <div class="tag">linux</div>
  <div class="tag">nginx</div>
  <div class="tag">node.js</div>
  <div class="tag">certbot</div>
  <div class="tag">ssh</div>
</div>

<div class="section">
  <div class="endpoint">
    <div><span class="method">GET</span> /health</div>
    <a class="btn" href="/health" target="_blank">open</a>
  </div>
  <div class="endpoint">
    <div><span class="method">GET</span> /info</div>
    <a class="btn" href="/info" target="_blank">open</a>
  </div>
</div>

<div class="footer">
  Built by Iman • ${new Date().toUTCString()}
</div>

<script>
setInterval(() => {
  fetch('/health')
    .then(res => res.json())
    .then(data => {
      document.getElementById('uptime').innerText = data.uptime;
    });
}, 5000);
</script>

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
