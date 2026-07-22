# 🚀 Dynamic API Mocking Dashboard

A full-stack, high-performance web application that empowers frontend, mobile, and QA engineers to instantly generate **live, shareable, CORS-enabled mock API endpoints** with simulated latency, custom HTTP status codes, and JSON response bodies.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma_ORM-v7-2d3748)
![Vercel Postgres](https://img.shields.io/badge/Database-Vercel_PostgreSQL-000000)

---

## 🌟 Key Features

- **⚡ Live Shareable Endpoint URLs**: Generate public URLs (`/api/mock/[slug]`) instant usable in any React, Next.js, Vue, Flutter, iOS, or Android application.
- **⏱ Simulated Latency & Delay**: Configure custom artificial response delays (0ms to 5000ms) to test loading skeletons, spinners, and async UI states.
- **🎯 Custom HTTP Status Codes**: Test edge cases and error boundaries with status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).
- **🌐 Full CORS Support**: Pre-configured `Access-Control-Allow-Origin: *` headers out of the box.
- **📊 Real-time Analytics**: Track hits/requests served, total endpoints, and average latency.
- **🧪 In-App API Tester Drawer**: Execute live HTTP requests directly inside the dashboard to view response payloads and precise response duration.
- **🔒 Secure Authentication**: NextAuth.js credentials provider (with password hashing) + Google OAuth support.
- **🎨 Dual Theme (Dark / Light)**: Glassmorphism aesthetic with Sun/Moon theme switcher.
- **📱 100% Mobile Responsive**: Compact analytics grid, mobile-friendly modals, and smooth sliding navigation drawer.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Database & ORM**: Vercel PostgreSQL, Prisma v7 (`@prisma/adapter-pg` driver)
- **Auth**: NextAuth.js (Credentials + Google OAuth)
- **Icons & UI**: Lucide React, Sonner (Toast notifications)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/nextjs-api-mocking.git
cd nextjs-api-mocking
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Vercel PostgreSQL Connection Strings
DATABASE_URL="postgres://user:password@host:5432/dbname?sslmode=require"
POSTGRES_PRISMA_URL="postgres://user:password@host:5432/dbname?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://user:password@host:5432/dbname?sslmode=require"

# NextAuth Secret & URL
NEXTAUTH_SECRET="super-secret-random-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Initialize Prisma Database
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Example Usage Scenarios

### Example 1: E-Commerce Products List (200 OK + 2s Delay)
- **Endpoint Name**: `Get E-Commerce Products`
- **URL Slug**: `products-list`
- **HTTP Method**: `GET`
- **Status Code**: `200 OK`
- **Simulated Latency**: `2000 ms`
- **JSON Payload**:
```json
{
  "status": "success",
  "count": 2,
  "products": [
    {
      "id": 101,
      "title": "Wireless Noise-Canceling Headphones",
      "price": 199.99,
      "inStock": true
    },
    {
      "id": 102,
      "title": "Mechanical RGB Keyboard",
      "price": 129.50,
      "inStock": true
    }
  ]
}
```
**Frontend Usage (`fetch`)**:
```javascript
fetch("http://localhost:3000/api/mock/products-list")
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### Example 2: Simulating Error Boundaries (401 Unauthorized)
- **Endpoint Name**: `Expired Session Error`
- **URL Slug**: `auth/unauthorized`
- **HTTP Method**: `POST`
- **Status Code**: `401 Unauthorized`
- **Simulated Latency**: `500 ms`
- **JSON Payload**:
```json
{
  "error": "Unauthorized",
  "message": "Your authentication token has expired. Please sign in again."
}
```

---

## 🌐 Deploying to Vercel

This project is **100% Production Ready for Vercel**.

1. Push your repository to GitHub.
2. Import your repository into [Vercel](https://vercel.com/new).
3. Connect your **Vercel Postgres Database** under the **Storage** tab.
4. Add the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (`https://your-app.vercel.app`)
5. Click **Deploy**! Vercel will automatically build and publish your app.

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
