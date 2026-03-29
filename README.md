# 🌐 ConnectHub - Enterprise-Grade Social Intelligence API

[![Node.js](https://img.shields.io/badge/Node.js-v22.13.4-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Postman Docs](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)](https://documenter.getpostman.com/view/29989813/2sB3dQwAJx)

**ConnectHub** is a sophisticated, highly scalable social intelligence ecosystem. Engineered using **Enterprise-Grade** patterns, it provides an ultra-secure RESTful backend (API v1) for modern social platforms requiring high-availability, advanced security (2FA/OAuth), and diverse content management.

---

## 🚀 Architectural Modules & High-Level Features

### 🛡️ Security & Identity Management
ConnectHub prioritizes user data integrity through a multi-layered security stack:
*   **Next-Gen Authentication**: Integrated **Google OAuth 2.0** and traditional **System** providers.
*   **Dual-Layer MFA**: Support for **Two-Factor Authentication (2FA)** via TOTP (Speakeasy), providing bank-level security for account protection.
*   **JWT Ecosystem**: Advanced Token Rotation (Access/Refresh) with highly secure encryption (`crypto-js`).
*   **Account Hygiene**: Automatic account activation via encrypted email tokens and robust password recovery workflows.

### 📱 Core Social Intelligence
*   **Intelligent Content Engine**: Full CRUD lifecycle for posts and comments with support for **Archiving/Restoring** to prevent data loss.
*   **Multi-Media Orchestration**: Native integration with **Cloudinary** for scalable storage of Images, Videos, Audio, and Documents.
*   **Engagement Framework**: Low-latency Like/Unlike systems and hierarchical (nested) threading for sophisticated user conversations.
*   **Identification via QR**: Seamless profile discovery and sharing through dynamically generated **QR Codes**.

### 💼 Administrative Governance
Complete platform oversight built for power users:
*   **Real-time Dashboarding**: High-level data insights through the `/admin/data` endpoint.
*   **Granular RBAC**: Strict Role-Based Access Control (RBAC) across three privilege tiers: `user`, `admin`, and `superAdmin`.
*   **Systemic Moderation**: Tools to manage roles and user permissions dynamically.

---

## 🛠️ Performance & Scalability Stack
Designed to handle millions of interactions with precision:
*   **Smart Pagination**: Efficient resource retrieval using `mongoose-paginate-v2` for high-performance lazy loading.
*   **Defensive Security**: Built-in protection against common vulnerabilities:
    *   **Rate Limiting**: To mitigate Brute-Force/DDoS.
    *   **Security Headers**: Hardened with **Helmet**.
    *   **Anti-XSS**: Input sanitization to neutralize malicious injection.
*   **Global Error Orchestration**: Centralized management ensures clean API responses and prevents internal data leaks.

---

## 📚 Interactive API Documentation

Every endpoint is meticulously documented with detailed Request/Response schemas, error codes, and testing variables.

👉 **[Explore Full Documentation on Postman](https://documenter.getpostman.com/view/29989813/2sB3dQwAJx)**

---

## ⚙️ Engineering Setup

### 1. Requirements
*   Node.js v22+
*   MongoDB Cluster (Atlas)
*   Cloudinary Infrastructure
*   Google Developer Console (for OAuth)

### 2. Deployment on Locally
```bash
# Clone the repository
git clone https://github.com/your-username/ConnectHub-API.git

# Install dependencies
npm install

# Build & Run (Production)
npm run build
npm start

# Hot Reload (Development)
npm run dev
```

### 3. Environment Variables (.env)
```env
# Database Credentials
DATABASE_DB=your_mongo_uri

# Infrastructure
CLOUD_NAME=cloudinary_id
CLOUD_API=cloudinary_key
CLOUD_SECRET=cloudinary_secret

# OAuth 2.0
CLIENT_ID=google_client_id
CLIENT_SECRET=google_secret

# Communication
USER_SENDER=smtp_user
PASS_EMAIL=smtp_pass (app_password)
```

---

## 📁 Repository Structure
```text
/
├── Src/              # Core Source Code
│   ├── Modules/      # Feature-First Architecture
│   ├── Middleware/   # Auth, Validation, Global Error Handling
│   ├── Utils/        # External Cloud Tools (Cloudinary, QR)
│   └── bootstrap.ts  # Application Orchestrator
├── Database/         # Mongoose Schema & Engine Configs
├── package.json      # Dependencies (Hashed/Verified)
└── vercel.json       # Deployment Configuration
```

---

## 🔗 Author & Maintenance
Developed and maintained by **[Abdelrahman](https://github.com/Abdelrahman2656)**.
Built to empower the next generation of social connectivity.
