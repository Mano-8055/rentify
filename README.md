# 🏠 Rentify

### Peer-to-Peer Rental Marketplace with Trust-Based Verification

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

Rentify is a full-stack peer-to-peer rental marketplace that enables users to rent products from nearby people within a configurable radius while maintaining trust and safety through identity verification and a dynamic trust-score system.

The platform allows users to list products for rent, discover nearby rental items, manage rental requests, track rental history, and evaluate user reliability using a likelihood score mechanism.

---

# 🌟 Key Features

| Feature | Description |
|----------|-------------|
| 🔐 Authentication | Secure JWT-based Register/Login system |
| 📍 Nearby Rentals | Discover products within 10km radius |
| ⭐ Trust Score | Dynamic user reliability scoring system |
| 🏷 Product Listings | Upload products with hourly & daily pricing |
| 🖼 Image Upload | Product image management |
| 🆔 Government ID Verification | Verify users using official identification |
| 📊 Dashboard | Manage products, requests, and rentals |
| 📜 Rental History | Track all rental transactions |
| 📱 Responsive UI | Mobile-first responsive design |
| 🌙 Modern Theme | Dark UI with Tailwind CSS |
| 🛡 Secure Backend | Protected APIs with JWT middleware |
| 🚀 Cloud Deployment | MongoDB Atlas + Render + Vercel |

---

# 📸 Application Preview

## Home Page

- Modern hero section
- Featured categories
- Trust score explanation
- Nearby rental highlights

## Nearby Products

- Geolocation powered search
- Product cards
- Distance filtering
- Category filters

## Dashboard

- Manage uploaded products
- View rental requests
- Track rental history
- Monitor trust score

## Profile

- User information
- Verification status
- Trust badge
- Rental statistics

---

# 🏗 System Architecture

```text
┌────────────────────┐
│   React Frontend   │
└─────────┬──────────┘
          │ Axios Requests
          ▼
┌────────────────────┐
│ Express REST APIs  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ JWT Authentication │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ MongoDB Atlas DB   │
└────────────────────┘
```

---

# 🛠 Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API
- Browser Geolocation API

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- CORS

## Database

- MongoDB Atlas (Cloud Database)

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 📁 Project Structure

```text
rentify/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       │   ├── images/
│       │   └── icons/
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Loader.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── AddProduct.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── NearbyProducts.jsx
│       │   ├── RentHistory.jsx
│       │   └── Profile.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── UserContext.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── productService.js
│       │   └── rentalService.js
│       │
│       ├── hooks/
│       │   └── useLocation.js
│       │
│       ├── utils/
│       │   └── calculateDistance.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── db.js
    │   │   └── jwt.js
    │   │
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   └── Rental.js
    │   │
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── productController.js
    │   │   ├── rentalController.js
    │   │   └── userController.js
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── productRoutes.js
    │   │   ├── rentalRoutes.js
    │   │   └── userRoutes.js
    │   │
    │   ├── middlewares/
    │   │   ├── authMiddleware.js
    │   │   ├── uploadMiddleware.js
    │   │   └── errorMiddleware.js
    │   │
    │   ├── utils/
    │   │   ├── calculateTrustScore.js
    │   │   └── geoLocation.js
    │   │
    │   ├── app.js
    │   └── server.js
    │
    ├── .env
    ├── package.json
    └── README.md
```

---

# 🗄 Database Design

## User Schema

| Field | Type |
|---------|---------|
| name | String |
| email | String |
| password | String |
| governmentId | String |
| likelihoodPoints | Number |
| profileImage | String |
| location | Object |
| rentalHistory | Array |

---

## Product Schema

| Field | Type |
|---------|---------|
| name | String |
| description | String |
| category | String |
| images | Array |
| priceHour | Number |
| priceDay | Number |
| owner | ObjectId |
| location | Object |
| availability | Boolean |

---

## Rental Schema

| Field | Type |
|---------|---------|
| renter | ObjectId |
| owner | ObjectId |
| product | ObjectId |
| startDate | Date |
| endDate | Date |
| rentalType | String |
| totalAmount | Number |
| status | String |

---

# ⚙️ Installation & Setup

## Prerequisites

- Node.js v18+
- Git
- MongoDB Atlas Account

---

## Clone Repository

```bash
git clone https://github.com/yourusername/rentify.git

cd rentify
```

---

## Install Backend Dependencies

```bash
cd backend

npm install
```

---

## Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

# ▶ Running the Application

## Terminal 1 — Backend

```bash
cd backend

npm run dev
```

Expected:

```text
MongoDB Connected
Server running on port 5000
```

---

## Terminal 2 — Frontend

```bash
cd frontend

npm run dev
```

Expected:

```text
Local: http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## Products

```http
GET    /api/products
GET    /api/products/nearby
GET    /api/products/:id

POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

---

## Rentals

```http
POST   /api/rentals
GET    /api/rentals/my-rentals
GET    /api/rentals/owner-requests

PUT    /api/rentals/:id/accept
PUT    /api/rentals/:id/reject
PUT    /api/rentals/:id/return
PUT    /api/rentals/:id/complete
```

---

## Users

```http
GET  /api/users/profile
PUT  /api/users/profile
PUT  /api/users/location
POST /api/users/govt-id
```

---

# 🛡 Trust Score System

Every user begins with:

```text
100 Trust Points
```

### Score Updates

| Event | Points |
|---------|---------|
| On-Time Return | +5 |
| Late Return | -10 |
| Damaged Product | -20 |
| Fraud Activity | -50 |

---

### User Rating Levels

| Score | Rating |
|---------|---------|
| 90-100 | 🏆 Excellent |
| 70-89 | ✅ Good |
| 50-69 | ⚠ Fair |
| 30-49 | 🔸 Poor |
| 0-29 | 🚨 Risky |

---

# 📦 Rental Workflow

```text
PENDING
   │
   ▼
ACCEPTED
   │
   ▼
RETURNED
   │
   ▼
COMPLETED

OR

PENDING
   │
   ▼
REJECTED
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcryptjs)
- Protected API Routes
- Government ID Verification
- Trust-Based Reputation System
- Authorization Middleware
- Environment Variable Protection
- MongoDB Atlas Cloud Security
- CORS Protection

---

# ⚡ Performance Optimizations

- React Lazy Loading
- Route-Based Code Splitting
- Axios Instance Reuse
- Optimized API Requests
- Tailwind Utility Optimization
- Memoized Components
- Geolocation Caching
- Efficient MongoDB Queries

---

# 🚀 Future Enhancements

- Stripe Payment Integration
- Real-Time Chat System
- Push Notifications
- AI Fraud Detection
- QR-Based Product Verification
- Product Recommendation Engine
- Multi-Language Support
- React Native Mobile Application

---

# 🌐 Deployment

## Frontend (Vercel)

```bash
npm run build
```

Set:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Backend (Render)

Environment Variables:

```env
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Build Command:

```text
npm install
```

Start Command:

```text
npm start
```

---

# 🎯 Project Highlights

- Built a full-stack MERN application
- Implemented JWT Authentication
- Developed geolocation-based product discovery
- Designed a trust-score reputation system
- Created protected routes and secure APIs
- Integrated MongoDB Atlas cloud database
- Built responsive UI using Tailwind CSS
- Followed MVC architecture principles

---

# 💡 Viva Questions & Answers

### How does geolocation work?

The browser's Geolocation API fetches latitude and longitude coordinates. The backend calculates distance using the Haversine formula and returns products within a 10km radius.

### How is authentication implemented?

JWT tokens are generated after login and stored in localStorage. Protected backend routes verify tokens using middleware.

### How does the trust score work?

Users begin with 100 points. Rental completion updates the score depending on whether the item was returned on time, late, damaged, or involved fraud.

### Why MongoDB Atlas?

MongoDB Atlas provides a cloud-hosted, scalable NoSQL database that integrates easily with Node.js and supports secure deployments.

### Why React + Tailwind?

React provides reusable component-based architecture, while Tailwind CSS enables rapid UI development with utility-first styling.

---

# 👨‍💻 Author

**Manoshankar**

Integrated M.Tech Software Engineering  
Vellore Institute of Technology (VIT)

GitHub:
https://github.com/Mano-8055

---

⭐ If you found this project useful, please consider giving it a star.