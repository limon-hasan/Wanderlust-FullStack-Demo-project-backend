<div align="center">

# 🛠️ Wanderlust — Backend REST API

A lightweight, serverless RESTful API powering the **Wanderlust** travel discovery and booking platform, built with **Node.js**, **Express**, and **MongoDB Atlas**.

[![API Status](https://img.shields.io/badge/API_Status-Online-brightgreen?style=for-the-badge&logo=vercel)](https://wanderlust-backend-green.vercel.app)
[![Frontend Repository](https://img.shields.io/badge/Frontend-Repository-blue?style=for-the-badge&logo=github)](https://github.com/limon-hasan/Wanderlust-FullStack-Demo-project-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

This repository contains the backend API server for the Wanderlust travel platform[cite: 16]. It handles data persistence, destination listings, and booking operations with MongoDB Atlas, optimized for zero-cold-start serverless execution on Vercel[cite: 16].

* **Live API Base URL:** [wanderlust-backend-green.vercel.app](https://wanderlust-backend-green.vercel.app)[cite: 16]
* **Client Application:** [wanderlust-frontend-livid.vercel.app](https://wanderlust-frontend-livid.vercel.app)
* **Frontend Source Code:** [Wanderlust-FullStack-Demo-project-frontend](https://github.com/limon-hasan/Wanderlust-FullStack-Demo-project-frontend)

---

## ✨ Features

- **RESTful API Architecture:** Clean, modular endpoints structured for travel discovery, destination filtering, and booking management.
- **MongoDB Atlas Integration:** Document-based storage configured with optimized queries and connection pooling.
- **Serverless Ready:** Configured via `vercel.json` for on-demand serverless execution with instant response times and zero idle server costs[cite: 16].
- **CORS & Security:** Configured with Cross-Origin Resource Sharing (CORS) headers to ensure secure communication with the Next.js frontend client.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) (ES6+ / CommonJS)[cite: 16] |
| **Framework** | [Express.js](https://expressjs.com/)[cite: 16] |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose / MongoDB Native Driver)[cite: 16] |
| **Deployment** | [Vercel Serverless Functions](https://vercel.com/)[cite: 16] |
| **Configuration** | Dotenv, CORS[cite: 16] |

---

## 📁 Project Structure

```text
├── index.js                # Express app entry point, middleware, routes, and DB connection
├── vercel.json             # Vercel serverless routing and build configuration
├── package.json            # Project dependencies and script declarations
├── package-lock.json       # Exact lockfile for dependency resolution
├── .gitignore              # Git ignored files (node_modules, .env)
├── LICENSE                 # MIT License file
└── README.md               # Backend API documentation
```

---

## 🔌 API Endpoints (Overview)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API root health check (`Server is running`) |
| `GET` | `/api/destinations` | Fetch all available travel destinations |
| `GET` | `/api/destinations/:id` | Fetch specific destination details |
| `POST` | `/api/bookings` | Create a new destination reservation |
| `GET` | `/api/bookings` | Fetch user bookings |

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** (v18.x or later)
- **npm** or **yarn**
- **MongoDB Atlas URI** (or local MongoDB instance)

### 1. Clone the repository

```bash
git clone [https://github.com/limon-hasan/Wanderlust-FullStack-Demo-project-backend.git](https://github.com/limon-hasan/Wanderlust-FullStack-Demo-project-backend.git)
cd Wanderlust-FullStack-Demo-project-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
```

### 4. Start the server

```bash
# Start server
npm start
```

The API server will run at `http://localhost:5000`.

---

## ☁️ Deployment Configuration

This backend runs on Vercel using the following `vercel.json` routing configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

---

## 👨‍💻 Author

**Maksudul Hasan Limon**
- GitHub: [@limon-hasan](https://github.com/limon-hasan)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE)[cite: 16].
