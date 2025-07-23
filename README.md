# 🧾 Ticketing App – Load Balanced with NGINX & Docker

[![Docker](https://img.shields.io/badge/Dockerized-Yes-blue?logo=docker)](https://www.docker.com/)
[![NGINX](https://img.shields.io/badge/Reverse_Proxy-NGINX-brightgreen?logo=nginx)](https://nginx.org/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

This is a ticketing web application I built using **Docker Compose**. I run **three instances** of the web app behind an **NGINX reverse proxy** configured as a **load balancer**. To secure the application, I use **HTTPS** via self-signed certificates. MongoDB and Mongo Express are included for persistence and easy database administration.

---

## 🧱 Architecture Overview

Here's how the architecture looks:

```
Client ──> NGINX (HTTPS 443)
                  |
      ┌────────────┴────────────┐
      │         Load            │
      │       Balancer          │
      └────────────┬────────────┘
           ┌───────┴────────┐
    web-app-1   web-app-2   web-app-3
           └───────┬────────┘
                MongoDB ←── Mongo Express
```

- I use the `least_conn` algorithm to distribute requests to the web app containers.
- All incoming requests go through NGINX which proxies them to the backend containers.
- Mongo Express provides a web interface for interacting with MongoDB.

---

## 🔐 HTTPS with Self-Signed Certificates

I use self-signed certificates for local development. These are **not committed to the repo**.

### 🔧 How I Generated the Certificates

```bash
mkdir -p nginx/certs

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/nginx-selfsigned.key \
  -out nginx/certs/nginx-selfsigned.crt \
  -subj "/C=US/ST=Dev/L=Local/O=TicketingApp/OU=Dev/CN=localhost"
```

> 📌 **I excluded the `nginx/certs/` folder in `.gitignore` to avoid pushing sensitive dev certs to GitHub.**

---

## 🐳 How I Run It

I use Docker Compose to bring everything up:

```bash
docker compose up --build
```

The services exposed include:

- `https://localhost` – main app via NGINX on port **443**
- `http://localhost` – HTTP automatically redirects to HTTPS
- `https://localhost:8081/mongo-express` – Mongo Express (secured under reverse proxy)

---

## ⚖️ Load Balancing Strategy

In `nginx.conf`, I defined the upstream with:

```nginx
upstream ticketing_upstream {
    least_conn;
    server web-app-1:3000;
    server web-app-2:3000;
    server web-app-3:3000;
}
```

The `least_conn` method routes requests to the instance with the fewest active connections, which helps maintain an even load distribution across app instances.

---

## 🗂️ Project Structure

```
ticketing-app/
│
├── docker-compose.yml
├── .env
├── nginx/
│   ├── nginx.conf
│   └── certs/                ← (Not committed)
│       ├── nginx-selfsigned.crt
│       └── nginx-selfsigned.key
├── src/ (app source code)
```

---

## 📦 .env Configuration

Here's a sample of the environment variables I used:

```env
MONGODB_URI=mongodb://mongodb:27017/ticketing
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=pass
ME_CONFIG_MONGODB_ADMINUSERNAME=admin
ME_CONFIG_MONGODB_ADMINPASSWORD=pass
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=admin
```

---

## 📄 .gitignore (Important!)

To protect secrets and dev-only files, I included this in `.gitignore`:

```
.env
nginx/certs/
```

---

## 📃 License

I released this project under the [MIT License](LICENSE).

---

## ✅ TL;DR

> I built a ticketing app running 3 instances of a web service behind NGINX with load balancing (`least_conn`) and HTTPS using self-signed certs. MongoDB + Mongo Express support data storage and admin.