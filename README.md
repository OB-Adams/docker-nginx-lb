# 🧾 Ticketing App – Reverse Proxy Load Balanced with NGINX & HTTPS

This is my containerized **Ticketing App** deployed using **Docker Compose**. It features a robust reverse proxy load balancing setup using **NGINX**, three replicated **Next.js web-app** instances, a **MongoDB** database, and **Mongo Express** for UI-based database inspection. SSL is handled via **self-signed certificates**, making it accessible securely via `https://localhost`.

---

## 🚀 Architecture

```
                 ┌────────────┐
                 │   Client   │
                 └─────┬──────┘
                       │  HTTPS (443)
                       ▼
               ┌───────────────┐
               │   NGINX LB    │
               └─────┬─────────┘
                     ▼
        ┌────────────┴────────────┐
        │     Load Balanced       │
        │     Web App Pool        │
        │  ┌─────────┬─────────┐  │
        │  │ web-app-1 │ web-app-2 │ ... web-app-3
        │  └─────────┴─────────┘  │
        └────────────┬────────────┘
                     ▼
              ┌────────────┐
              │  MongoDB   │
              └────┬───────┘
                   ▼
           ┌──────────────┐
           │ Mongo Express│
           └──────────────┘
```

---

## ⚙️ Features

- ✅ **Reverse Proxy** via NGINX
- 🔁 **Least Connection Load Balancing**
- 🔒 **HTTPS with Self-Signed Certificates**
- 🧱 **Modular Docker Services**
- 🐳 **MongoDB + Mongo Express UI**

---

## 🧩 NGINX Configuration

I configured NGINX as both an SSL terminator and a load balancer using the `least_conn` algorithm to evenly distribute load across the three web-app containers. Here's the full `nginx.conf` file:

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include mime.types;

    upstream ticketing_upstream {
        least_conn;
        server web-app-1:3000;
        server web-app-2:3000;
        server web-app-3:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name localhost;

        ssl_certificate /etc/nginx/certs/nginx-selfsigned.crt;
        ssl_certificate_key /etc/nginx/certs/nginx-selfsigned.key;

        location / {
            proxy_pass http://ticketing_upstream;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 📦 Docker Compose Overview

- **Three replicated Next.js apps**: `web-app-1`, `web-app-2`, and `web-app-3`
- **NGINX container**: Mounted with the config and certs
- **MongoDB and Mongo Express** containers
- Exposes both `80` and `443` on the NGINX container for HTTP->HTTPS redirection and secure access

---

## 🔐 Self-Signed Certificates

The certificates are generated using OpenSSL and **not committed to the repo** (they're mounted via volume). Example command used:

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout nginx-selfsigned.key \
  -out nginx-selfsigned.crt
```

They are stored locally in `./nginx/certs/` and mounted into the NGINX container at `/etc/nginx/certs`.

---

## 🏁 Usage

1. Clone the repo
2. Generate self-signed certs in `nginx/certs/`
3. Run with Docker Compose:

```bash
docker compose up --build
```

4. Visit your app at:  
   🔗 https://localhost  
   🧪 Accept the self-signed cert in your browser

---

## ❗ Note

> I’ve excluded the certificate files from this repo for security reasons. You’ll need to generate your own in the `nginx/certs/` directory.

---

## 📂 Repo Structure

```
ticketing-app/
│
├── nginx/
│   ├── nginx.conf
│   └── certs/
│       ├── nginx-selfsigned.crt
│       └── nginx-selfsigned.key
├── Dockerfile
├── docker-compose.yml
├── .env
└── ...
```

---

## 📜 License

MIT – feel free to use, modify, and share.
