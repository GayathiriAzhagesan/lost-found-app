# Lost & Found – Campus Item Recovery Platform

A full-stack MERN platform enabling students, faculty, and campus staff to report, track, claim, and recover lost and found possessions across university grounds.

---

## Current Status: Phase 1 Completed ✅

- **Phase 1: Project structure + frontend + backend setup** (Completed)
  - Full clean directory structure created for both `frontend/` and `backend/`.
  - Express REST API configured with CORS, JWT, controllers, routes, middleware, and structured in-memory mock repository.
  - React + Vite frontend configured with React Router, Axios interceptor client, AuthContext, AppContext, and complete page routing hierarchy.
  - In-memory mock repositories active (MongoDB is intentionally deferred to Phase 10 as specified).
  - Both frontend and backend running and fully test-verified.

---

## Project Structure

```
lost-and-found/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   ├── item/
│   │   │   ├── claim/
│   │   │   └── notifications/
│   │   ├── pages/
│   │   │   ├── Landing/
│   │   │   ├── Auth/ (Login, Register)
│   │   │   ├── Dashboard/
│   │   │   ├── LostItems/
│   │   │   ├── FoundItems/
│   │   │   ├── ItemDetails/
│   │   │   ├── ReportItem/
│   │   │   ├── MyItems/
│   │   │   ├── MyClaims/
│   │   │   ├── Notifications/
│   │   │   ├── Profile/
│   │   │   └── Admin/ (Dashboard, Users, Items, Claims)
│   │   ├── context/ (AuthContext.jsx, AppContext.jsx)
│   │   ├── services/ (api.js, authService.js, itemService.js, claimService.js, notificationService.js)
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── routes/ (AppRoutes.jsx)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/ (db.js)
│   ├── controllers/ (authController.js, itemController.js, claimController.js, notificationController.js, adminController.js)
│   ├── middleware/ (authMiddleware.js, adminMiddleware.js, errorMiddleware.js)
│   ├── models/ (User.js, Item.js, Claim.js, Notification.js)
│   ├── routes/ (authRoutes.js, itemRoutes.js, claimRoutes.js, notificationRoutes.js, adminRoutes.js)
│   ├── data/ (mockStore.js)
│   ├── utils/ (generateToken.js, validation.js)
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## How to Run

### 1. Run Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 2. Run Frontend Client
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## Demo Credentials for Testing

| Account Role | Email | Password |
|---|---|---|
| **Campus Student** | `student@campus.edu` | `password123` |
| **Campus Admin** | `admin@campus.edu` | `password123` |

---

## 12-Phase Development Roadmap

- [x] **PHASE 1**: Project structure + frontend + backend setup
- [ ] **PHASE 2**: Landing page + Navbar + Footer polish
- [ ] **PHASE 3**: Login + Register + JWT authentication deep polish
- [ ] **PHASE 4**: Dashboard
- [ ] **PHASE 5**: Lost/Found item CRUD
- [ ] **PHASE 6**: Search + filters + item details
- [ ] **PHASE 7**: Claim system
- [ ] **PHASE 8**: Notifications
- [ ] **PHASE 9**: Admin dashboard
- [ ] **PHASE 10**: MongoDB + Mongoose integration
- [ ] **PHASE 11**: Image upload/storage
- [ ] **PHASE 12**: Testing + bug fixing + deployment
