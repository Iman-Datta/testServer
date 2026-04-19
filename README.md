# self-hosted-server

A minimal self-hosted server running on a personal Linux machine — built to understand the full lifecycle of a web request, from DNS resolution to a locally running backend.

---

## what this is

Most developers write code and deploy to a managed platform. This project skips that — the goal was to own every layer: the machine, the OS, the network, the TLS certificate, and the reverse proxy. No Vercel, no Railway, no AWS. Just a mini PC sitting on a desk, serving real HTTPS traffic.

Live endpoint: **https://testserver.imandatta.com/**

---

## stack

| layer         | technology                  |
| ------------- | --------------------------- |
| OS            | Debian Linux                |
| runtime       | Node.js + Express           |
| reverse proxy | Nginx                       |
| TLS           | Let's Encrypt + Certbot     |
| remote access | SSH                         |
| network       | static IP + port forwarding |

---

## hardware

- Intel Core i5, 8th Gen (mini PC)
- Self-hosted at home, publicly accessible via port forwarding

---

## how it works

```
user types testserver.imandatta.com/
       ↓
DNS resolves to home IP
       ↓
router forwards :80 and :443 to the mini PC
       ↓
Nginx receives the request
       ↓
Nginx terminates TLS (Let's Encrypt cert)
       ↓
Nginx reverse proxies to Node.js on :3000
       ↓
Express handles the request and responds
```

Understanding this flow end-to-end was the entire point.

---

## endpoints

| method | path      | description                                                         |
| ------ | --------- | ------------------------------------------------------------------- |
| GET    | `/`       | landing page                                                        |
| GET    | `/health` | returns `{ status: "ok", uptime: "..." }`                           |
| GET    | `/info`   | returns live system info (hostname, platform, memory, Node version) |

---

## setup overview

### 1. static IP

Assigned a static local IP to the machine so the router always forwards to the same address.

### 2. nginx config

```nginx
server {
    listen 80;
    server_name https://testserver.imandatta.com/;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    https://testserver.imandatta.com/
    ssl_certificate /etc/letsencrypt/live/https://testserver.imandatta.com//fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/livehttps:/testserver.imandatta.com//privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. TLS with certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d https://testserver.imandatta.com/
```
### 4. run the server

```bash
npm install
node server.js
```

To keep it running after logout:

```bash
npm install -g pm2
pm2 start server.js --name server
pm2 save
pm2 startup
```

---

## project structure

```
.
├── server.js        # express server
├── package.json
└── README.md
```

---

## why

Moving beyond just writing code. Setting this up required understanding networking, Linux system administration, TLS, reverse proxying, and DNS — things that are usually abstracted away by deployment platforms. Now they aren't.

---

## author

**Iman Datta** — B.Tech IoT, IEM Gurukul, Kolkata  
[imandatta.com](https://imandatta.com)
