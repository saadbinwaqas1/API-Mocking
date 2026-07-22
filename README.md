# 🚀 Dynamic API Mocking Dashboard

A simple, clean, and modern full-stack web application built for frontend and mobile app developers. Instantly generate **live, shareable, CORS-enabled mock API links** with simulated latency (delay), custom HTTP status codes (200, 404, 500), and custom JSON payloads.

---

## 📖 How to Use This App (Step-by-Step Guide)

### 1️⃣ Sign Up or Log In
1. Open the application at `http://localhost:3000` or your live Vercel URL.
2. Switch to the **Sign Up** tab to create a new account, or **Sign In** with existing credentials / Google OAuth.

### 2️⃣ Create a New Mock API Endpoint
1. On your Dashboard, click the **"Create Mock API"** button.
2. Fill in the modal fields:
   - **Endpoint Name**: E.g. `Get Products List`
   - **URL Slug**: E.g. `products-list` (Your endpoint will be generated at `/api/mock/products-list`).
   - **HTTP Method**: Choose `GET`, `POST`, `PUT`, `DELETE`, or `PATCH`.
   - **HTTP Status Code**: Choose `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, or `500 Server Error`.
   - **Simulated Latency (Delay)**: Set artificial response delay slider (e.g. `2000 ms` to test loading spinners).
   - **JSON Response Body**: Enter or paste your desired fake JSON structure. Click **Format JSON** to validate syntax.
3. Click **"Save & Generate API"**.

### 3️⃣ Copy & Use the Shareable API Link
1. Find your newly created endpoint card in the Dashboard grid.
2. Click the **Copy Button** next to `/api/mock/products-list` to copy the live shareable URL.
3. Paste the URL directly into your React, Next.js, Vue, Flutter, iOS, or Android project!

**Frontend Code Example (`fetch`)**:
```javascript
fetch("http://localhost:3000/api/mock/products-list")
  .then((res) => {
    console.log("Status Code:", res.status); // Output: 200
    return res.json();
  })
  .then((data) => {
    console.log("Mock Response Data:", data);
  });
```

### 4️⃣ Test Endpoints Right Inside Dashboard
- Click **"Test API"** on any endpoint card.
- A live tester modal will execute the request, show the simulated delay timer, response status code, and live JSON output.

### 5️⃣ Manage Theme & Account
- **Theme Toggle**: Click the **Sun ☀️ / Moon 🌙** button in the header to switch between Light and Dark themes.
- **Account Settings**: Click your user avatar in the header to update your Name, Change Password, or Delete Account.

---

## 🛠 Local Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/saadbinwaqas1/API-Mocking.git
cd API-Mocking

# 2. Install packages
npm install

# 3. Create .env file with dummy placeholders:
# DATABASE_URL="postgres://user:password@host:5432/dbname?sslmode=require"
# NEXTAUTH_SECRET="your-nextauth-secret-key"

# 4. Push database schema
npx prisma db push

# 5. Start development server
npm run dev
```

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
