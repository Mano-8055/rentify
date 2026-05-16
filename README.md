# 🏠 Rentify — Peer-to-Peer Rental Marketplace

A full-stack rental platform where users can rent products from nearby neighbors within a 10km radius, with a trust-score system to ensure safe transactions.

---

## 🚀 Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based register/login with persistent sessions |
| **Nearby Products** | Geolocation-powered search within configurable radius (default 10km) |
| **Trust Score** | Automatic scoring system (0–100) updated after each rental |
| **Product Listings** | Add items with images, hourly & daily pricing, categories |
| **Rental Workflow** | Request → Accept/Reject → Return → Complete lifecycle |
| **Government ID** | Upload ID for account verification badge |
| **Dashboard** | Manage incoming requests, active rentals, and listings |
| **Profile** | View trust score, stats, edit name, change avatar |
| **Rent History** | Full transaction history as both renter and owner |

---

## 🛠 Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS (dark glassmorphism theme)
- React Router DOM v7
- Axios (with auto auth interceptors)
- Context API (AuthContext + UserContext)

### Backend
- Node.js + Express.js (ES Modules)
- MongoDB Atlas + Mongoose
- JWT Authentication
- Multer (local file uploads)
- bcryptjs

---

## 📁 Project Structure

```
rentify/
├── frontend/
│   └── src/
│       ├── components/   # Navbar, Footer, ProductCard, Loader, ProtectedRoute
│       ├── pages/        # Home, Login, Register, NearbyProducts, AddProduct,
│       │                 # ProductDetails, Profile, Dashboard, RentHistory
│       ├── context/      # AuthContext, UserContext
│       ├── services/     # api.js, authService, productService, rentalService
│       ├── hooks/        # useLocation
│       └── utils/        # calculateDistance
│
└── backend/
    └── src/
        ├── config/       # db.js, jwt.js
        ├── models/       # User, Product, Rental
        ├── controllers/  # auth, product, rental, user
        ├── routes/       # auth, product, rental, user
        ├── middlewares/  # authMiddleware, uploadMiddleware
        └── utils/        # calculateTrustScore, geoLocation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd rentify

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Backend Environment

Edit `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_here
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Application

```bash
# Terminal 1 — Backend (from /backend)
npm run dev

# Terminal 2 — Frontend (from /frontend)
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5001/api`

---

## 📡 API Reference

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login, returns JWT token
GET    /api/auth/me           Get current user (requires auth)
```

### Products
```
GET    /api/products           Get all available products
GET    /api/products/nearby    Get products within radius (?lat=&lng=&radius=)
GET    /api/products/mine      Get my listed products (auth)
GET    /api/products/:id       Get product by ID
POST   /api/products           Create product with images (auth, multipart)
PUT    /api/products/:id       Update product (auth, owner only)
DELETE /api/products/:id       Delete product (auth, owner only)
```

### Rentals
```
POST   /api/rentals            Request a rental (auth)
GET    /api/rentals/my-rentals         My rentals as renter (auth)
GET    /api/rentals/owner-requests     Requests on my items (auth)
PUT    /api/rentals/:id/accept         Accept request (auth, owner)
PUT    /api/rentals/:id/reject         Reject request (auth, owner)
PUT    /api/rentals/:id/return         Mark as returned (auth, renter)
PUT    /api/rentals/:id/complete       Confirm complete + update trust (auth, owner)
```

### Users
```
GET    /api/users/profile      Get my profile (auth)
PUT    /api/users/profile      Update name/profile image (auth, multipart)
PUT    /api/users/location     Update location coordinates (auth)
POST   /api/users/govt-id      Upload government ID (auth, multipart)
GET    /api/users/:id          Get public user profile
```

---

## 🛡️ Trust Score System

| Event | Points Change |
|---|---|
| On-time return | +5 (max 100) |
| Late return | −10 |
| Item damaged | −20 |
| Fraud detected | −50 |

| Score Range | Rating | Badge |
|---|---|---|
| 90–100 | Excellent | 🏆 |
| 70–89 | Good | ✅ |
| 50–69 | Fair | ⚠️ |
| 30–49 | Poor | 🔸 |
| 0–29 | Risky | 🚨 |

---

## 📦 Rental Lifecycle

```
PENDING → ACCEPTED → RETURNED → COMPLETED
         ↓ REJECTED
```

1. **Renter** sends request → status: `pending`
2. **Owner** accepts → status: `accepted`, product marked unavailable
3. **Renter** marks returned → status: `returned`
4. **Owner** confirms return type → status: `completed`, trust score updated, product available again

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
# Set VITE_API_URL=https://your-render-backend.onrender.com/api
# Set VITE_BACKEND_URL=https://your-render-backend.onrender.com
```

### Backend → Render
```
Build command: npm install
Start command: npm start
Environment variables:
  MONGO_URI=<atlas_uri>
  JWT_SECRET=<secret>
  PORT=10000
  FRONTEND_URL=https://your-vercel-app.vercel.app
```

> Note: For production image uploads, consider migrating from local Multer storage to Cloudinary.

---

## 💡 Viva Explanation Points

**Q: How does the 10km geolocation work?**  
A: The browser's Geolocation API fetches lat/lng. The backend uses the Haversine formula to calculate the great-circle distance between two GPS coordinates, filtering products within the specified radius.

**Q: How is the trust score calculated?**  
A: Each user starts with 100 points. When an owner completes a rental, they submit a returnType (onTime/late/damage/fraud). The `calculateTrustScore` utility adjusts the renter's points accordingly, bounded between 0–100.

**Q: How is authentication implemented?**  
A: JWT tokens are generated on login/register and stored in localStorage. The Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request. The `protect` middleware on the backend verifies the token and attaches the user to `req.user`.

**Q: How is file upload handled?**  
A: Multer middleware processes `multipart/form-data` requests. Files are stored in `backend/uploads/` subdirectories. Express serves them statically at `/uploads/*`. Frontend constructs full URLs using `BACKEND_URL + filePath`.

**Q: How does the rental workflow prevent conflicts?**  
A: When an owner accepts a rental, `product.availability` is set to `false`, preventing other renters from booking it. On completion, availability is restored to `true`.

**Q: What is glassmorphism and how is it implemented?**  
A: Glassmorphism is a design style using semi-transparent backgrounds with blur effects. In Tailwind, it's achieved with `backdrop-blur-xl` and `bg-white/5` (5% opacity white background) combined with subtle borders.

---

## 📸 Key Pages

- `/` — Hero landing page with 3D card effects, features, and trust score guide
- `/register` & `/login` — Glassmorphism auth forms
- `/nearby` — Geolocation-powered product grid with category/radius filters
- `/products/:id` — Product details + rental booking form with price calculator
- `/add-product` — Multi-image upload with category and pricing
- `/dashboard` — Rental request management (accept/reject/complete)
- `/profile` — Trust score ring, stats, listings, and rental history
- `/rent-history` — Full rental transaction history

---

Built with ❤️ using React · Node.js · MongoDB · Tailwind CSS
