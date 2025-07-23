# 🧾 Ticketing App – Load Balanced with NGINX & HTTPS

This is my containerized **Ticketing App** deployed using **Docker Compose**. It uses **NGINX as a reverse proxy** and **load balancer** to evenly distribute traffic across three replicated web app instances. Each instance is a **Next.js** app connected to a shared **MongoDB** database, with **Mongo Express** for database management. The app is secured using **HTTPS with self-signed certificates**.

---

## 🧠 Architecture Overview

```
                      ┌────────────┐
                      │   Browser  │
                      └─────┬──────┘
                            │
                     ┌──────▼──────┐
                     │    NGINX    │
                     │  (Reverse   │
                     │   Proxy +   │
                     │ Load Balancer)
                     └──────┬──────┘
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
      ┌──────────┐    ┌──────────┐     ┌──────────┐
      │ web-app-1│    │ web-app-2│     │ web-app-3│
      └────┬─────┘    └────┬─────┘     └────┬─────┘
           │               │                │
           └──────┬────────┴────────┬───────┘
                  ▼                 ▼
                     ┌────────────────┐
                     │    MongoDB     │
                     └────────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Mongo Express   │
                   └──────────────────┘
```

---

## ⚙️ Features

- ✅ **Reverse proxy** for secure centralized routing
- 🔁 **Load balancing** using `least_conn` (least number of active connections)
- 🧩 **Three replicated web-app containers**
- 🔒 **HTTPS using self-signed certificates**
- 🧱 **MongoDB** for persistence
- 💻 **Mongo Express** for UI-based DB access
- 📦 Fully containerized with Docker Compose

---

## 🔧 NGINX Configuration

Here’s the full `nginx.conf` I’m using inside the `nginx/` directory:

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

The key part is:

```nginx
upstream ticketing_upstream {
    least_conn;
    ...
}
```

which uses the **least connections algorithm** to direct new requests to the container with the fewest active connections.

---

## 📦 Docker Compose Summary

My `docker-compose.yml` file defines:

- **Three replicas** of the Next.js app (`web-app-1`, `web-app-2`, `web-app-3`)
- **NGINX** for load balancing and HTTPS termination
- **MongoDB** database
- **Mongo Express** UI for DB management

NGINX mounts both the custom `nginx.conf` and self-signed certificates.

It exposes ports:

```yaml
ports:
  - "80:80"
  - "443:443"
```

---

## 🔐 Self-Signed HTTPS

I generated my certs using:

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout nginx-selfsigned.key \
  -out nginx-selfsigned.crt
```

They’re placed in `nginx/certs/` and **not committed to the repo**. They're mounted inside the container at `/etc/nginx/certs/`.

---

## 🛠️ Getting Started

1. Clone the repo
2. Create a `.env` file based on the example
3. Generate self-signed certs in `nginx/certs/`
4. Start the stack:

```bash
docker compose up --build
```

Then open [https://localhost](https://localhost) and accept the self-signed cert warning in your browser.

---

## 📁 Repo Structure

```
ticketing-app/
├── nginx/
│   ├── nginx.conf
│   └── certs/
│       ├── nginx-selfsigned.crt
│       └── nginx-selfsigned.key
├── docker-compose.yml
├── .env
├── Dockerfile
└── (web app source files)
```

---

## 🛑 .gitignore Note

Make sure you’ve added:

```
nginx/certs/*
!.gitkeep
```

to avoid pushing the private key and certificate.

---

## 📜 License

MIT – free to use, modify, and distribute.
