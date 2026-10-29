# LostLink — Smart Lost-and-Found Management Platform

> *"Lost Something? Let's Find It."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/LostLink)
[![Tests](https://img.shields.io/badge/tests-21%20passed-success)](https://github.com/your-username/LostLink)
[![Stack](https://img.shields.io/badge/stack-MERN%20%7C%20REST%20%7C%20Vercel-blue)](https://github.com/your-username/LostLink)
[![License](https://img.shields.io/badge/license-ISC-green)](LICENSE)

---

## 1. Project Overview

**LostLink** is a centralized, digital lost-and-found management web application designed specifically for colleges, universities, campuses, libraries, hostels, and educational institutions.

The platform replaces chaotic WhatsApp groups, untracked notice boards, and scattered desk logs with a modern, rule-based matching engine, privacy-preserving claim verification, and auditable safe handover workflows.

- **GitHub Repository:** `https://github.com/your-username/LostLink` *(Placeholder)*
- **Live Deployment:** `https://lostlink.vercel.app` *(Placeholder)*

---

## 2. Real-World Problem Statement

Every day, students, faculty, and campus staff misplace essential belongings:
- University Student ID cards & access badges
- Laptops, wireless earbuds, smartwatches, and phone chargers
- Wallets, purses, and transit cards
- Keys (room, locker, and bike keys)
- Calculators, textbooks, and class notebooks
- Backpacks, water bottles, jackets, and eyeglasses

### Why Current Campus Solutions Fail:
1. **Scattered Channels:** Lost items are broadcasted across ephemeral social media chats, unofficial Discord servers, or classroom whiteboards where rightful owners rarely see them.
2. **Privacy Violations:** Finders often publish uncensored photos of student ID cards or wallets, exposing full names, student numbers, addresses, and private identifying details.
3. **Fraud & False Claims:** Without a verification mechanism, opportunistic individuals can claim valuable electronics by simply guessing common item descriptions.
4. **Lack of Safe Handover Protocols:** Informal exchanges create personal safety risks for students meeting strangers in isolated areas.

**LostLink solves this** with a centralized portal featuring privacy redaction, automated similarity matching, two-party ownership verification, and designated campus safe handover zones.

---

## 3. Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript ES6+, React 19, React Router v7, Axios, Lucide React | Functional components, hooks, reusable UI design system, mobile-first responsive layout |
| **Backend** | Node.js (v24), Express.js (v4.21), RESTful Architecture | Modular controllers, middleware, JWT auth, input validation, error handling |
| **Database** | MongoDB, Mongoose ODM (v8.10) | Schemas with validation, indexes, references, text search, in-memory MongoDB fallback |
| **Security** | bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit | Password hashing, role authorization, rate limiting, security headers, privacy redaction |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`), Supertest, MongoMemoryServer | 21 automated end-to-end integration tests covering auth, CRUD, matching, claims, and admin |
| **Deployment** | Vercel Serverless Functions, MongoDB Atlas, Git & GitHub | Serverless API handler (`api/index.js`), Vite static frontend (`client/dist`), `vercel.json` |

---

## 4. Application Architecture

LostLink follows an MVC + Services design pattern optimized for both local development and Vercel serverless deployment:

```
                            ┌──────────────────────────────────┐
                            │    ReactJS Client (Vite SPA)     │
                            │  HTML5 / CSS3 / Lucide Icons     │
                            └─────────────────┬────────────────┘
                                              │ HTTP / JSON (REST API)
                                              ▼
                            ┌──────────────────────────────────┐
                            │      Express.js API Layer        │
                            │   Helmet / CORS / Rate Limiter   │
                            └─────────────────┬────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐            ┌──────────────────┐
    │  Auth & Access   │            │  Matching Engine │            │  Claim Handover  │
    │  JWT / bcryptjs  │            │  Weighted Score  │            │  State Machine   │
    └─────────┬────────┘            └─────────┬────────┘            └─────────┬────────┘
              │                               │                               │
              └───────────────────────────────┼───────────────────────────────┘
                                              ▼
                            ┌──────────────────────────────────┐
                            │       Mongoose ODM Layer         │
                            │ Cached Serverless Connection     │
                            └─────────────────┬────────────────┘
                                              ▼
                            ┌──────────────────────────────────┐
                            │ MongoDB Database (Atlas / Local) │
                            │ Users, Reports, Claims, Audits   │
                            └──────────────────────────────────┘
```

---

## 5. Folder Structure

```
LostLink/
├── .env.example                  # Documented environment variable template
├── .gitignore                    # Excludes node_modules, build artifacts, and secrets
├── package.json                  # Root npm configuration with concurrent scripts
├── vercel.json                   # Vercel deployment and routing configuration
├── README.md                     # Comprehensive documentation
│
├── api/
│   └── index.js                  # Vercel serverless function entrypoint (Mongoose pooling)
│
├── server/
│   └── src/
│       ├── config/
│       │   └── database.js       # Mongoose connection with serverless cache & memory fallback
│       ├── controllers/
│       │   ├── adminController.js       # User governance, report moderation, audit logs
│       │   ├── authController.js        # Registration, login, logout, getMe
│       │   ├── claimController.js       # Ownership claims, review, handover transitions
│       │   ├── dashboardController.js   # Genuine MongoDB user & admin statistics
│       │   ├── notificationController.js# In-app alert management
│       │   ├── reportController.js      # CRUD operations, privacy filtering, search
│       │   └── userController.js        # Profile viewing and updating
│       ├── middleware/
│       │   ├── authenticate.js   # JWT verification and user hydration
│       │   ├── authorize.js      # Role-based access control (admin, moderator)
│       │   ├── errorHandler.js   # Centralized error handler with safe production output
│       │   └── validate.js       # Request payload sanitization and validation
│       ├── models/
│       │   ├── AuditLog.js       # Administrative action audit records
│       │   ├── Claim.js          # Claim lifecycle, private verification, handover details
│       │   ├── ItemReport.js     # Lost & found item schemas with text search indexes
│       │   ├── Notification.js   # In-app notification alerts
│       │   └── User.js           # Users with hashed passwords and role governance
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   ├── claimRoutes.js
│       │   ├── dashboardRoutes.js
│       │   ├── notificationRoutes.js
│       │   ├── reportRoutes.js
│       │   └── userRoutes.js
│       ├── services/
│       │   ├── matchingService.js     # Rule-based similarity scoring engine
│       │   └── notificationService.js # Persistent in-app notifications
│       ├── utils/
│       │   ├── ApiError.js       # Custom operational error class
│       │   └── asyncHandler.js   # Higher-order async wrapper
│       ├── app.js                # Express app configuration & middleware
│       ├── seed.js               # Database seed script with realistic campus records
│       └── server.js             # HTTP server entrypoint
│
├── client/
│   ├── index.html                # HTML5 entrypoint with Google Fonts (Inter, Outfit)
│   ├── package.json              # Frontend dependencies (React, Router, Lucide, Axios)
│   ├── vite.config.js            # Vite configuration with /api proxy to port 5000
│   └── src/
│       ├── assets/               # Brand assets and graphics
│       ├── components/
│       │   ├── ConfirmDialog.jsx     # Reusable action confirmation modal
│       │   ├── Footer.jsx            # Responsive campus footer
│       │   ├── ItemCard.jsx          # Reusable item card with status badges
│       │   ├── LoadingSpinner.jsx    # Inline and full-page loading indicators
│       │   ├── Navbar.jsx            # Sticky responsive navigation with mobile drawer
│       │   ├── NotificationBell.jsx  # Unread badge counter and alert dropdown
│       │   ├── Pagination.jsx        # Server-side pagination controls
│       │   ├── ProtectedRoute.jsx    # Auth & role-based route guard
│       │   └── StatusBadge.jsx       # Color-coded status badges with Lucide icons
│       ├── context/
│       │   └── AuthContext.jsx       # Authentication state, login, register, logout
│       ├── pages/
│       │   ├── admin/
│       │   │   └── AdminDashboard.jsx# Admin metrics, user suspend/reactivate, moderation
│       │   ├── dashboard/
│       │   │   └── UserDashboard.jsx # User metrics, tabbed report & claim management
│       │   ├── About.jsx             # Mission, real-world campus problem, privacy
│       │   ├── BrowseItems.jsx       # Search, category filter, type filter, pagination
│       │   ├── Home.jsx              # Landing page, hero, live stats, categories, FAQ
│       │   ├── HowItWorks.jsx        # 6-step verification and handover guide
│       │   ├── ItemDetails.jsx       # Single item view, match suggestions, claim modal
│       │   ├── Login.jsx             # User login with 1-click test credentials
│       │   ├── NotFound.jsx          # 404 error page
│       │   ├── Profile.jsx           # User profile viewing and updating
│       │   ├── Register.jsx          # New user registration
│       │   ├── ReportFoundItem.jsx   # Report found item with responsible listing notes
│       │   └── ReportLostItem.jsx    # Report lost item with private verification fields
│       ├── services/
│       │   └── api.js                # Axios instance with request/response interceptors
│       ├── utils/
│       │   └── constants.js          # Shared categories list
│       ├── index.css                 # Comprehensive custom CSS design system
│       ├── App.jsx                   # React Router routing configuration
│       └── main.jsx                  # React DOM mount point
│
└── tests/
    ├── admin.test.js             # User suspension, report moderation, audit logging tests
    ├── auth.test.js              # Registration, login, JWT validation, role guard tests
    ├── claims.test.js            # Claim lifecycle, competing claims, return transition tests
    ├── matching.test.js          # Rule-based similarity algorithm and scoring tests
    ├── reports.test.js           # CRUD operations, privacy redaction, search tests
    └── setup.js                  # MongoMemoryServer lifecycle and test user generator
```

---

## 6. Database Schema & Collections

All application records are persisted in MongoDB via Mongoose schemas:

### A. `User` Collection
- `name` (String, required, min 2, max 80)
- `email` (String, required, unique, lowercase, trimmed)
- `passwordHash` (String, required, `select: false` to prevent accidental credential leakage)
- `role` (String, enum: `['user', 'moderator', 'admin']`, default: `'user'`)
- `phone` (String, trimmed, optional)
- `institution` (String, default: `'Campus Community'`)
- `accountStatus` (String, enum: `['active', 'suspended']`, default: `'active'`)
- `createdAt`, `updatedAt` (Timestamps)
- **Indexes:** `{ email: 1 }` (unique), `{ role: 1 }`, `{ accountStatus: 1 }`

### B. `ItemReport` Collection
- `title` (String, required, min 3, max 120)
- `description` (String, required, min 10, max 2000)
- `category` (String, required, enum: Electronics, ID Cards and Documents, Bags and Backpacks, Wallets and Purses, Keys, Books and Stationery, Clothing, Water Bottles, Jewellery and Accessories, Other)
- `reportType` (String, enum: `['lost', 'found']`, required)
- `dateOccurred` (Date, required)
- `approximateLocation` (String, required, max 200)
- `imageUrl` (String, default photo or placeholder)
- `identifyingDetails` (String, private to owner/admin, never returned in public listings)
- `status` (String, enum: `['active', 'under_claim', 'returned', 'archived', 'hidden']`, default: `'active'`)
- `moderationStatus` (String, enum: `['approved', 'flagged', 'hidden']`, default: `'approved'`)
- `moderationNotes` (String, default: `''`)
- `reporterId` (ObjectId, ref: `'User'`, required)
- `archivedAt` (Date, default: `null`)
- `createdAt`, `updatedAt` (Timestamps)
- **Indexes:** `{ reportType: 1, status: 1 }`, `{ category: 1 }`, `{ reporterId: 1 }`, Text index on `{ title: 'text', description: 'text', approximateLocation: 'text' }`

### C. `Claim` Collection
- `reportId` (ObjectId, ref: `'ItemReport'`, required)
- `claimantId` (ObjectId, ref: `'User'`, required)
- `finderId` (ObjectId, ref: `'User'`, required)
- `claimMessage` (String, required, min 10, max 1500)
- `privateVerificationDetails` (String, confidential proof submitted by claimant)
- `status` (String, enum: `['pending', 'under_review', 'approved', 'rejected', 'cancelled']`, default: `'pending'`)
- `reviewNotes` (String, notes provided by finder/admin)
- `handoverStatus` (String, enum: `['none', 'scheduled', 'completed']`, default: `'none'`)
- `handoverDetails`:
  - `location` (String)
  - `scheduledDate` (Date)
  - `notes` (String)
- `resolvedAt` (Date, timestamp when return completed)
- `createdAt`, `updatedAt` (Timestamps)
- **Indexes:** `{ reportId: 1, claimantId: 1 }`, `{ finderId: 1, status: 1 }`, `{ claimantId: 1, status: 1 }`

### D. `Notification` Collection
- `recipientId` (ObjectId, ref: `'User'`, required)
- `type` (String, enum: `['match_found', 'claim_received', 'claim_status_updated', 'handover_scheduled', 'item_returned', 'report_moderated', 'system']`)
- `title` (String, required)
- `message` (String, required)
- `relatedReportId` (ObjectId, ref: `'ItemReport'`)
- `relatedClaimId` (ObjectId, ref: `'Claim'`)
- `isRead` (Boolean, default: `false`)
- `createdAt`, `updatedAt` (Timestamps)
- **Indexes:** `{ recipientId: 1, isRead: 1, createdAt: -1 }`

### E. `AuditLog` Collection
- `actorId` (ObjectId, ref: `'User'`, required)
- `action` (String, required, e.g. `'USER_SUSPENDED'`, `'REPORT_MODERATED'`, `'ITEM_RETURN_COMPLETED'`)
- `resourceType` (String, enum: `['User', 'ItemReport', 'Claim', 'System']`)
- `resourceId` (String, required)
- `metadata` (Mixed object containing previous/new states)
- `timestamp` (Date, default: `Date.now`)
- **Indexes:** `{ actorId: 1, timestamp: -1 }`, `{ resourceType: 1, resourceId: 1 }`

---

## 7. CRUD Operations Breakdown

| Operation | Entity | Endpoint | Method | Authorization | Business Rules Applied |
|---|---|---|---|---|---|
| **Create** | Report | `/api/reports` | POST | Authenticated User | Validates input; sets `reporterId`; evaluates potential matches in background; alerts opposing reporters. |
| **Read** | Reports List | `/api/reports` | GET | Public | Excludes archived and hidden items; server-side text search; pagination; redacts sensitive identifying details. |
| **Read** | Report Detail | `/api/reports/:id` | GET | Public / Auth | Sanitizes reporter email and phone for non-owners; shows owner private notes only to creator/admin. |
| **Update** | Report | `/api/reports/:id` | PUT | Owner or Admin | Only creator or admin can update; blocks editing items that are already returned or archived. |
| **Delete** | Report | `/api/reports/:id` | DELETE | Owner or Admin | Soft deletion / safe archival (`status: 'archived'`) to preserve relational integrity with existing claims. |
| **Create** | Claim | `/api/claims` | POST | Authenticated User | Prevents user from claiming self-reported items; blocks duplicate active claims; transitions report to `'under_claim'`. |
| **Read** | My Claims | `/api/claims/mine` | GET | Authenticated User | Returns claims submitted by authenticated user with populated item details and finder information. |
| **Update** | Claim Review | `/api/claims/:id/status`| PATCH | Finder or Admin | Finder or admin approves, rejects, or holds claim; claimant cannot review own claim; auto-reverts status if all claims rejected. |
| **Update** | Handover | `/api/claims/:id/handover`| PATCH | Finder, Claimant, Admin | Coordinates meeting; marking `'completed'` updates item status to `'returned'` and cancels competing active claims. |

---

## 8. RESTful API Documentation

### Base URL: `/api`

### A. Authentication Endpoints

#### `POST /api/auth/register`
- **Description:** Registers a new student or staff user.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Alex Rivera",
    "email": "alex.rivera@campus.edu",
    "password": "Student@LostLink2026!",
    "phone": "+1 (555) 012-3456",
    "institution": "Faculty of Science & Computing"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful! Welcome to LostLink.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67210...",
      "name": "Alex Rivera",
      "email": "alex.rivera@campus.edu",
      "role": "user",
      "phone": "+1 (555) 012-3456",
      "institution": "Faculty of Science & Computing"
    }
  }
  ```

#### `POST /api/auth/login`
- **Description:** Authenticates user credentials and returns a JWT session token.
- **Access:** Public (Rate-limited: 100 requests / 15 min)
- **Request Body:**
  ```json
  {
    "email": "alex.rivera@campus.edu",
    "password": "Student@LostLink2026!"
  }
  ```
- **Response (200 OK):** Returns `token` and `user` object.

#### `GET /api/auth/me`
- **Description:** Retrieves currently authenticated user session.
- **Access:** Private (`Bearer <token>`)

---

### B. Item Reports Endpoints

#### `GET /api/reports`
- **Description:** Search and filter public lost and found reports.
- **Access:** Public
- **Query Parameters:**
  - `search` (String): Search query in title, description, or location.
  - `category` (String): Filter by item category.
  - `reportType` (String): `'lost'` or `'found'`.
  - `status` (String): `'active'`, `'under_claim'`, `'returned'`, or `'all'`.
  - `location` (String): Regex filter on approximate location.
  - `sort` (String): `'newest'`, `'oldest'`, `'date'`.
  - `page` (Integer, default: 1), `limit` (Integer, default: 12).
- **Response (200 OK):** Returns `{ total, page, totalPages, limit, reports: [...] }`.

#### `GET /api/reports/:id`
- **Description:** Retrieve full details for a single item report.
- **Access:** Public (with optional authentication to detect ownership)
- **Response (200 OK):** Returns `{ report, isOwner, userClaim }`. Redacts private phone and email for non-owners.

#### `POST /api/reports`
- **Description:** Create a new lost or found report.
- **Access:** Private
- **Request Body:**
  ```json
  {
    "title": "Sony WH-1000XM4 Wireless Headphones",
    "description": "Black over-ear noise-cancelling headphones left near the quiet study cubicles.",
    "category": "Electronics",
    "reportType": "lost",
    "dateOccurred": "2026-10-27T10:00:00Z",
    "approximateLocation": "Central Library, 2nd Floor Study Area",
    "imageUrl": "https://example.com/headphones.jpg",
    "identifyingDetails": "Small scratch on left pivot arm."
  }
  ```

#### `PUT /api/reports/:id`
- **Description:** Update an existing item report.
- **Access:** Private (Owner or Administrator only)

#### `DELETE /api/reports/:id`
- **Description:** Safely withdraw and archive a report.
- **Access:** Private (Owner or Administrator only)

#### `GET /api/reports/:id/matches`
- **Description:** Computes potential matches from opposing report type using similarity algorithm.
- **Access:** Private
- **Response (200 OK):** Returns `{ targetReport, matches: [{ report, matchScore, matchReasons, disclaimer }] }`.

---

### C. Claims & Handover Endpoints

#### `POST /api/claims`
- **Description:** Submit an ownership claim for an item.
- **Access:** Private
- **Request Body:**
  ```json
  {
    "reportId": "67210b37...",
    "claimMessage": "I forgot these headphones after my physics exam on table 14.",
    "privateVerificationDetails": "Initials 'AR' etched inside headband."
  }
  ```

#### `GET /api/claims/mine`
- **Description:** Returns all claims submitted by the current user.
- **Access:** Private

#### `GET /api/claims/received`
- **Description:** Returns all claims received on items reported as found by the current user.
- **Access:** Private

#### `PATCH /api/claims/:id/status`
- **Description:** Review and transition claim status (`'approved'`, `'rejected'`, `'under_review'`, `'cancelled'`).
- **Access:** Private (Finder or Administrator only)
- **Request Body:**
  ```json
  {
    "status": "approved",
    "reviewNotes": "Initials match proof of purchase."
  }
  ```

#### `PATCH /api/claims/:id/handover`
- **Description:** Schedule or finalize physical return of belonging.
- **Access:** Private (Finder, Claimant, or Administrator)
- **Request Body:**
  ```json
  {
    "handoverStatus": "completed"
  }
  ```

---

### D. Dashboard & Administration Endpoints

#### `GET /api/dashboard/user`
- **Description:** Returns genuine user-specific statistics and recent activity from MongoDB.
- **Access:** Private

#### `GET /api/dashboard/admin`
- **Description:** Returns platform-wide metrics and recent audit logs.
- **Access:** Private (Admin or Moderator only)

#### `GET /api/admin/users`
- **Description:** List, search, and filter all registered campus accounts.
- **Access:** Private (Admin or Moderator)

#### `PATCH /api/admin/users/:id/status`
- **Description:** Suspend or reactivate a user account with audit logging.
- **Access:** Private (Admin only)
- **Request Body:** `{"status": "suspended", "reason": "Guidelines violation"}`

#### `PATCH /api/admin/reports/:id/moderation`
- **Description:** Approve, flag, or hide reported listings with audit logging.
- **Access:** Private (Admin or Moderator)

---

## 9. Smart Item Matching Algorithm

The matching engine in `server/src/services/matchingService.js` provides practical, rule-based similarity scoring between opposing `lost` and `found` reports:

### Formula & Weights:
$$\text{Score} = (W_{\text{title}} \times S_{\text{title}}) + (W_{\text{category}} \times S_{\text{category}}) + (W_{\text{desc}} \times S_{\text{desc}}) + (W_{\text{loc}} \times S_{\text{loc}}) + (W_{\text{date}} \times S_{\text{date}})$$

| Component | Weight | Calculation Method |
|---|---|---|
| **Item Title Similarity** | **35%** | Token Jaccard coefficient + substring overlap after stopword removal and lowercasing |
| **Exact Category Match** | **20%** | Binary match ($1.0$ if identical category, $0.0$ otherwise) |
| **Description Keywords** | **20%** | Common bag-of-words token intersection excluding common English stopwords |
| **Location Proximity** | **15%** | Normalized token similarity between campus location strings |
| **Date Proximity** | **10%** | Proximity decay: $\le 1\text{ day} \to 1.0$, $\le 3\text{ days} \to 0.9$, $\le 7\text{ days} \to 0.75$, $\le 14\text{ days} \to 0.5$, $\le 30\text{ days} \to 0.25$ |

### Safety Constraints:
- Excludes withdrawn, archived, hidden, and returned reports.
- Items reported by the same user are excluded from matching.
- **Ethical Disclaimer:** Every suggestion clearly displays: *"Possible Match — Please verify the item before claiming it."*

---

## 10. Claim & Ownership Verification Workflow

```
 [Student Finds Belonging] ───> [Publishes Found Report (Public Details Only)]
                                                 │
                                                 ▼
 [Owner Searches / Match Alert] ───> [Submits Claim + Private Proof]
                                                 │
                                                 ▼
 [Finder Reviews Evidence] ──────> [Approved] ──┬──> [Rejected (Report remains active)]
                                                │
                                                ▼
 [Handover Scheduled] ───────────> [Safe Zone Meeting (Library/Security)]
                                                │
                                                ▼
 [Handover Completed] ───────────> [Item Marked Returned / Competing Claims Resolved]
```

1. **Submit Claim:** The claimant describes how the item was lost and inputs private verification markers (e.g., custom stickers, engravings, serial digits, lockscreen photo).
2. **Review Evidence:** The finder reviews the submitted evidence. Competing claims can be put under review or rejected.
3. **Safe Handover:** Once approved, users schedule a meetup at a campus safe zone.
4. **Mark Returned:** After verified physical exchange, the claim is marked completed, transitioning the report to `'returned'` and recording an audit trail entry.

---

## 11. Security & Privacy Considerations

- **Password Security:** Passwords hashed with `bcryptjs` (salt rounds: 10). Password hashes are never selected by default (`select: false`).
- **JWT Authorization:** Tokens signed with `HS256` secret, expiration set to 7 days, validated on all protected endpoints.
- **Privacy Redaction:** Contact details (phone, email) are never rendered on public listings. Identifying details fields are restricted to report owners and finders.
- **Role-Based Access Control:** Role checks prevent standard students from accessing `/api/admin/*` routes or escalating their own privileges.
- **Rate Limiting:** Protects `/api/auth/login` and `/api/auth/register` against brute-force attacks (100 attempts / 15 min).
- **Helmet Headers:** HTTP security headers applied across all responses.
- **Audit Logging:** Administrative actions (user suspension, reactivation, report moderation, return finalization) are permanently logged with timestamps and actor IDs.

---

## 12. Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher; v24 recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/LostLink.git
cd LostLink
```

### 2. Install Dependencies
```bash
# Install root & backend dependencies
npm install

# Install client dependencies
npm --prefix client install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lostlink
JWT_SECRET=lostlink_super_secure_jwt_secret_key_campus_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Initial Seed Credentials
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@lostlink.edu
ADMIN_PASSWORD=Admin@LostLink2026!
ADMIN_INSTITUTION=Central University Campus
```

> **Note:** If MongoDB is not installed locally, LostLink automatically falls back to an embedded in-memory MongoDB server for testing and evaluation!

### 4. Seed the Database
Populate realistic campus accounts, reports, claims, and audit logs:
```bash
npm run seed
```

### 5. Run the Application
Launch both the backend API and frontend Vite dev server concurrently:
```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

---

## 13. Test Accounts for Evaluation

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@lostlink.edu` | `Admin@LostLink2026!` | Full admin portal access, user governance, report moderation, audit logs |
| **Moderator** | `moderator@lostlink.edu` | `Moderator@LostLink2026!` | Campus security moderation of flagged reports and claims |
| **Student (Alex)** | `alex.rivera@campus.edu` | `Student@LostLink2026!` | Standard student account with reported lost headphones and ID card |
| **Student (Priya)** | `priya.sharma@campus.edu` | `Student@LostLink2026!` | Finder account with incoming claims to review |
| **Student (David)** | `david.chen@campus.edu` | `Student@LostLink2026!` | Claimant account with returned Apple Watch record |

> *Tip: The Login page includes 1-click test buttons to populate these credentials instantly.*

---

## 14. Testing Instructions

LostLink includes an automated end-to-end integration test suite using Node.js's test runner, Supertest, and MongoMemoryServer:

```bash
npm test
```

### Verified Test Results (21 / 21 Passed):
- `Administrator Moderation & Audit Trail Suite`:
  - ✔ Admin can suspend and reactivate a user account with audit logging
  - ✔ Admin can moderate a report by flagging or hiding it
- `Authentication & Authorization Suite`:
  - ✔ POST `/api/auth/register` - successfully registers a new student user
  - ✔ POST `/api/auth/register` - rejects duplicate email
  - ✔ POST `/api/auth/login` - authenticates valid user with correct password
  - ✔ POST `/api/auth/login` - rejects invalid password
  - ✔ GET `/api/auth/me` - retrieves current user when authenticated
  - ✔ GET `/api/auth/me` - rejects unauthenticated request
  - ✔ GET `/api/admin/users` - rejects student role from admin endpoint (403)
  - ✔ GET `/api/admin/users` - allows admin role
- `Claims & Handover Verification Workflow Suite`:
  - ✔ Complete Claim Lifecycle: Submit -> Review -> Approve -> Handover -> Returned
- `Smart Item Matching Engine Suite`:
  - ✔ compareReports - calculates high similarity for matching lost and found reports
  - ✔ compareReports - calculates low score for unrelated items
  - ✔ findMatchesForReport - finds matching found items and excludes returned reports
- `Item Reports CRUD Suite`:
  - ✔ POST `/api/reports` - creates a lost item report
  - ✔ POST `/api/reports` - rejects report with missing required fields
  - ✔ GET `/api/reports` - lists reports with filters and pagination
  - ✔ GET `/api/reports/:id` - gets details and protects private contact details
  - ✔ PUT `/api/reports/:id` - allows reporter to edit their report
  - ✔ PUT `/api/reports/:id` - rejects edit by unauthorized user
  - ✔ DELETE `/api/reports/:id` - safely archives an eligible report

---

## 15. Production Build & Deployment

### Production Bundle Build
To validate the frontend build:
```bash
npm run build
```
Creates an optimized, tree-shaken client bundle in `client/dist`.

### Deployment to Vercel

1. **Push repository to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LostLink full-stack platform"
   git remote add origin https://github.com/your-username/LostLink.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
   - Import your `LostLink` GitHub repository.
   - Configure Build and Output Settings:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `client/dist`
   - Set Environment Variables in Vercel:
     - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
     - `JWT_SECRET`: A strong secret key
     - `NODE_ENV`: `production`
     - `CLIENT_URL`: Your Vercel production URL (e.g. `https://lostlink.vercel.app`)
   - Click **Deploy**.

Vercel will build the React frontend and map `/api/*` to the serverless function handler in `api/index.js` as defined in `vercel.json`.

---

## 16. Known Limitations & Future Enhancements

### Current Capabilities:
- Robust rule-based item matching with weighted score breakdowns.
- Secure, token-based authentication and role authorization.
- Full CRUD operations with soft archival and privacy protection.
- Complete claim verification and safe handover state machine.

### Future Roadmap:
- **Computer Vision (AI Image Tagging):** Integrate TensorFlow.js or cloud vision APIs to auto-detect object categories and colors from uploaded photographs.
- **Push & SMS Notifications:** Integrate Web Push and Twilio SMS for instant SMS alerts when a matching student ID card is found.
- **Campus SSO Integration:** Connect with university SAML/OAuth (e.g. Google Workspace for Education, Shibboleth, Canvas LMS).
- **Interactive Campus GIS Map:** Pin lost and found coordinates directly on an interactive Leaflet campus map.

---

## 17. License

This project is licensed under the ISC License. Built with passion for educational and campus communities.
