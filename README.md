# 🌱 EcoBin — Smart Waste Management for a Cleaner Campus

**EcoBin** is a modern, full-stack smart campus waste-management and community-cleanliness platform. It empowers students and campus administrators to report waste hotspots, detect waste materials using AI computer vision, locate nearby smart bins, participate in voluntary cleaning drives, submit Before & After proof, earn verified Eco Points, and compete on the campus leaderboard.

---

## 🎯 Core Concept Flow

`Detect → Report → Find → Clean → Verify → Reward → Track`

---

## ✨ Features Overview

### 🗑️ Waste Reporting
- Unique ID Generation (e.g. `ECO-2026-00124`).
- Categories: Plastic, Paper, Organic/Food, Glass, Metal, E-waste, Other.
- Status Tracking: `Pending`, `Assigned`, `Collected`, `Resolved`, `Rejected`.
- Automatic **+25 Eco Points** award upon report submission + **+25 bonus points** when resolved by Admin.

### 🤖 AI Waste Scanner Service
- Computer Vision abstraction (`wasteDetectionService.js`) with confidence scoring, waste classification, and recommended campus bin mapping.
- Visual scanning frame animation with instant category confirmation & 1-click report submission.
- Environment fallback: Clearly labelled demo/mock model active when external vision API key is omitted, ready for Google Cloud Vision / Clarifai API key plug-in.

### 📍 Interactive Campus Bin Locator
- Interactive Leaflet campus map showing smart bin locations.
- Live fill level indicators (0% – 100%) and color-coded status badges:
  - 🟢 **Available** (< 65% full)
  - 🟡 **Nearly Full** (65% – 89% full)
  - 🔴 **Full** (≥ 90% full)
- Category & status filtering pills.

### 🧹 Clean & Earn (Voluntary Cleaning Drives)
- Active campus missions gallery (e.g., *Clean College Botanical Garden* `+100 PTS`, *Classroom Block C Deep Drive* `+50 PTS`, *Campus Plastic Collection Drive* `+75 PTS`).
- Photo verification requirement: Students submit **Before** and **After** photos with activity descriptions.
- **Admin Verification**: Points are awarded strictly upon Admin review to prevent self-awarded points.

### ⭐ Eco Points, Levels & Ledger
- Tiered progression levels:
  - 🌱 **Eco Starter**: 0 – 499 PTS
  - 🌿 **Eco Helper**: 500 – 999 PTS
  - 🌳 **Eco Warrior**: 1,000 – 2,499 PTS
  - ♻️ **Eco Champion**: 2,500+ PTS
- Audit log ledger: Every point credit creates an immutable `EcoPointTransaction` record in MongoDB.

### 🏆 Campus Leaderboard & Badges
- Top 3 Podium highlights (Gold, Silver, Bronze styling).
- Filters for Overall, Monthly, and Department rankings.
- Auto-unlocked badges: `First Report`, `First Cleanup`, `Recycling Hero`, `Eco Warrior`, `Top Contributor`, `5 Missions Completed`, `10 Reports Submitted`.

### 👨💼 Admin Control Portal
- **Analytics Dashboard**: Real-time stats & Recharts graphs for waste category distribution, report status breakdown, and department points leaderboard.
- **Report Manager**: Search, filter, inspect photos, assign collection teams, and update statuses.
- **Mission Manager**: Create new cleaning drives and inspect side-by-side **Before vs After** proof photos for 1-click approval/rejection.
- **Bin Manager**: Add/edit campus bins, adjust fill levels %, and toggle availability.
- **User Manager**: Search user registry and toggle roles (`user` ↔ `admin`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM v6, Lucide React, Recharts, Leaflet / React Leaflet.
- **Backend**: Node.js, Express.js, REST API, JWT Authentication, bcryptjs password hashing, Multer.
- **Database**: MongoDB & Mongoose. Embedded `mongodb-memory-server` fallback included for 100% zero-config out-of-the-box local execution!
- **Image Storage**: Cloudinary integration service abstraction with DataURI fallback.
- **AI Service**: Modular `wasteDetectionService.js`.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ecobin.campus.edu` | `Admin123!` |
| **Student** | `alex.green@ecobin.campus.edu` | `Student123!` |

*(Quick demo login buttons are provided on the Login page for one-click access!)*

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### 1. Clone & Set Up Backend

```bash
cd backend
npm install
npm start
```
*Note: The backend automatically launches an embedded MongoDB instance if local MongoDB is unavailable, and automatically populates initial demo data on first launch! Backend runs on `http://localhost:5000`.*

### 2. Set Up Frontend

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:3000`** (Vite proxies `/api` to `http://localhost:5000` in dev).

## 🗺️ Maps (Google Maps + other providers)

- The **Campus Bin Locator** uses Leaflet with multiple map layers out-of-the-box, including **Google Maps (Streets/Satellite/Hybrid/Terrain)**, **OpenStreetMap**, **Carto Voyager/Dark**, and **Esri Satellite** (no API key required for basic usage).
- Optional environment variables in `frontend/.env` (see `frontend/.env.example`): `VITE_GOOGLE_MAPS_API_KEY`, `VITE_MAP_API_KEY`, `VITE_MAPBOX_TOKEN`.

---

## ⚙️ Environment Configuration (`.env`)

Backend environment template (`.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecobin
JWT_SECRET=ecobin_super_secret_jwt_key_2026

# Cloudinary Setup (Optional - Falls back to local DataURI storage if omitted)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Vision AI Setup (Optional - Uses built-in computer vision heuristic model if omitted)
GOOGLE_VISION_API_KEY=your_google_vision_api_key
```

---

## 📡 REST API Endpoints Overview

### Authentication
- `POST /api/auth/register` — Register student account
- `POST /api/auth/login` — Login user/admin
- `GET /api/auth/profile` — Get logged-in user profile & stats
- `PUT /api/auth/profile` — Update user profile

### Waste Reports
- `POST /api/reports` — Create waste report (+25 PTS)
- `GET /api/reports` — Get all reports (Admin/Filtered)
- `GET /api/reports/my` — Get user's submitted reports
- `PUT /api/reports/:id/status` — Update report status (Admin)

### Bin Locator
- `GET /api/bins` — Get campus bins with fill level & status
- `POST /api/bins` — Create new bin (Admin)
- `PUT /api/bins/:id` — Update bin fill level & status (Admin)

### Cleaning Missions
- `GET /api/missions` — Get active cleaning missions
- `POST /api/missions` — Create cleaning mission (Admin)
- `POST /api/missions/:id/join` — Join mission
- `POST /api/missions/:id/submit` — Upload Before & After proof photos
- `PUT /api/missions/submissions/:id/review` — Approve/Reject proof (Admin)

### Eco Points & Leaderboard
- `GET /api/users/points` — Get point balance, level & transaction history
- `GET /api/users/leaderboard` — Get campus rankings

---

## 🎓 College Presentation Walkthrough Guide

When presenting **EcoBin** to faculty or evaluators, follow this 5-step flow:

1. **Introduction & Motivation**:
   - Explain campus waste challenges and how gamification incentivizes student participation.
2. **AI Waste Scanner Demonstration**:
   - Go to **AI Scanner**, upload a plastic bottle photo, show AI category detection (Plastic, 94% confidence), and click *Proceed to Report*.
3. **Smart Bin Locator & Reporting**:
   - Show how the interactive map guides students to nearby available bins matching the waste category.
4. **Clean & Earn Mission Verification**:
   - Demonstrate joining *Clean College Botanical Garden*, uploading **Before** and **After** photos, logging into the **Admin Portal**, and clicking **Approve** to demonstrate instant Eco Point awards.
5. **Leaderboard & Analytics**:
   - Highlight the Recharts analytics in Admin Dashboard and show the student's rank advancement on the campus Leaderboard.
