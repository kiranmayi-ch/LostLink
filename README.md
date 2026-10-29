# LostLink — Smart Lost-and-Found Management Platform

A centralized, privacy-focused lost-and-found web application for educational institutions, university campuses, libraries, laboratories, and hostels.

**GitHub Repository:** https://github.com/kiranmayi-ch/LostLink

---

## 1. Project Overview

LostLink is a full-stack web application designed to simplify the process of reporting, discovering, claiming, and returning lost belongings within educational institutions.

Traditional lost-and-found systems often rely on WhatsApp groups, physical notice boards, and manually maintained registers. These methods make it difficult to search for items, coordinate ownership claims, protect personal information, and track successful returns.

LostLink provides a centralized digital platform with searchable reports, rule-based smart matching, private claim verification, handover tracking, and administrative moderation.

### Objectives

- Centralize lost-and-found reports in one searchable platform.
- Help users discover potentially matching lost and found items.
- Protect personal contact information and confidential ownership evidence.
- Provide a structured claim and handover workflow.
- Enable administrators to moderate reports and manage user accounts.
- Improve accountability through notifications and administrative audit logs.

## 2. Key Features

### User Features

- User registration, login, and authentication.
- Lost-item and found-item reporting.
- Search, category filters, report-type filters, and pagination.
- Smart matching suggestions with similarity scores and explanations.
- Ownership claim submission with private verification details.
- Claim review and handover status tracking.
- Personal dashboard for reports and claims.
- In-app notifications.
- Profile viewing and updating.
- Privacy-conscious public report views.

### Administrator Features

- Dashboard with platform statistics.
- User search and account suspension/reactivation.
- Report moderation, including flagging and hiding reports.
- Administrative activity and audit-log viewing.
- Role-based access for administrators and moderators.

### Security Features

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based authorization.
- Input validation and sanitization.
- Authentication rate limiting.
- Security headers using Helmet.
- Private contact and ownership details excluded from public report responses.
- Soft archival of eligible reports to preserve claim history.

## 3. Technology Stack

| Component | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+, React 19 |
| UI and routing | React Router v7, Lucide React |
| Build tool | Vite |
| HTTP client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | bcryptjs, JSON Web Tokens |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Node.js test runner, Node Assert, Supertest, mongodb-memory-server |
| Deployment configuration | Vercel |
| Version control | Git, GitHub |

## 4. System Architecture

LostLink follows an MVC + Services architecture, separating frontend components, API routes, controllers, middleware, business logic, and database access.

```text
             USER / ADMIN / MODERATOR
                       |
                       v
              React Frontend (Vite)
                       |
                       v
                 REST API
             Express.js Backend
                       |
          +------------+------------+
          |            |            |
          v            v            v
     Controllers   Middleware    Services
          |       Authentication  Matching
          |       Authorization   Notifications
          |       Validation
          +------------+------------+
                       |
                       v
                  Mongoose ODM
                       |
                       v
                   MongoDB
                       |
          +------------+------------+
          |            |            |
          v            v            v
        Users      Item Reports    Claims
                       |
                 +-----+-----+
                 |           |
                 v           v
            Notifications  Audit Logs
```

The deployment configuration uses a Vercel serverless entry point at `api/index.js` and a Vite frontend build.

## 5. Project Structure

```text
LostLink/
├── api/
│   └── index.js
├── server/
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       ├── seed.js
│       └── server.js
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── tests/
│   ├── admin.test.js
│   ├── auth.test.js
│   ├── claims.test.js
│   ├── matching.test.js
│   ├── reports.test.js
│   └── setup.js
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## 6. Prerequisites

Install the following tools before running the application:

- Node.js 24 or a compatible supported release.
- npm.
- MongoDB Atlas or a local MongoDB instance.
- Git (optional, for cloning the repository).

Verify the installation:

```bash
node --version
npm --version
git --version
```

## 7. Installation and Local Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/kiranmayi-ch/LostLink.git
cd LostLink
```

### Step 2: Install dependencies

Install the root and frontend dependencies:

```bash
npm install
npm --prefix client install
```

### Step 3: Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Configure the required values in the root `.env` file:

```dotenv
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/lostlink

JWT_SECRET=replace_with_a_random_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

The local MongoDB URI assumes MongoDB is installed and running on your computer.

Alternatively, use a MongoDB Atlas connection string for cloud database access.

**Important:** The variable names must match those used by the application. Never commit `.env` or put real credentials in `.env.example`.

### Step 4: Seed sample data

```bash
npm run seed
```

The seed script is intended to create sample users and item reports for testing. Verify the seed configuration before running it against an existing database.

### Step 5: Start the development servers

```bash
npm run dev
```

Expected local addresses, based on the project configuration:

| Service | Address |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

Open http://localhost:5173 in your browser.

If the frontend cannot find Vite, check that `client/package.json` declares Vite and that the frontend dependencies were installed successfully.

## 8. Smart Matching Algorithm

LostLink uses a rule-based weighted similarity engine to identify potentially matching lost and found reports.

| Factor | Weight |
|---|---:|
| Item title similarity | 35% |
| Exact category match | 20% |
| Description keyword overlap | 20% |
| Location similarity | 15% |
| Date proximity | 10% |
| **Total** | **100%** |

### Matching Process

1. Compare lost reports with found reports.
2. Normalize text by removing punctuation and common stopwords.
3. Calculate title similarity using token overlap and substring matching.
4. Compare categories, description keywords, and campus locations.
5. Apply a date-proximity score.
6. Exclude ineligible reports, including archived and returned items.
7. Generate similarity scores and human-readable explanations.

Example explanations:

- Exact category match: Electronics.
- Common keywords in title: Sony, headphones.
- Occurred within one day.

A matching score indicates a possible match, not proof of ownership. Claims must still be verified.

## 9. Claim and Handover Workflow

1. A student reports a lost or found item.
2. The matching engine identifies potentially related reports.
3. A claimant submits a claim with private identifying details.
4. The finder reviews the claim and approves, rejects, or requests further review.
5. Both parties arrange a supervised campus handover.
6. The handover is marked complete, the item status is updated, and relevant notifications are generated.

Recommended handover locations include the campus security office or a supervised library desk.

Users should not publish private ownership evidence, serial numbers, or personal contact details in public descriptions.

## 10. Database Design

LostLink uses MongoDB collections managed through Mongoose.

| Collection | Purpose |
|---|---|
| User | Accounts, password hashes, roles, and account status |
| ItemReport | Lost and found item descriptions, categories, locations, and status |
| Claim | Claim submissions, private evidence, review state, and handover status |
| Notification | In-app alerts and read status |
| AuditLog | Administrative actions and associated metadata |

The implementation report describes schema validation, ObjectId references, text-search indexes, and soft archival of reports.

## 11. API Endpoints

All API endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the authenticated user |

### Reports and profiles

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/me` | View profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/reports` | Search and filter reports |
| GET | `/api/reports/:id` | Get report details |
| POST | `/api/reports` | Create a report |
| PUT | `/api/reports/:id` | Update an owned report |
| DELETE | `/api/reports/:id` | Archive an eligible report |
| GET | `/api/reports/mine` | Get personal reports |
| GET | `/api/reports/:id/matches` | Retrieve matching suggestions |

### Claims

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/claims` | Submit a claim |
| GET | `/api/claims/mine` | View submitted claims |
| GET | `/api/claims/received` | View claims received |
| GET | `/api/claims/:id` | View claim details |
| PATCH | `/api/claims/:id/status` | Update claim review status |
| PATCH | `/api/claims/:id/handover` | Update handover status |

### Administration and notifications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard/user` | User dashboard statistics |
| GET | `/api/dashboard/admin` | Administrative dashboard |
| GET | `/api/admin/users` | Search and manage users |
| PATCH | `/api/admin/users/:id/status` | Change account status |
| GET | `/api/admin/reports` | View reports for moderation |
| PATCH | `/api/admin/reports/:id/moderation` | Moderate a report |
| GET | `/api/notifications` | Retrieve notifications |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |
| GET | `/api/health` | Health-check endpoint |

Access permissions depend on the configured authentication and authorization middleware. Verify the route definitions before relying on this table as a complete API contract.

## 12. Testing

Run the automated test suite:

```bash
npm test
```

The supplied implementation report records these results:

| Suite | Reported tests passed |
|---|---:|
| Administrator moderation and audit trail | 2 |
| Authentication and authorization | 8 |
| Claims and handover | 1 |
| Smart matching engine | 3 |
| Reports CRUD | 7 |
| **Total** | **21/21** |

**Reported result:** 21 tests executed, 21 passed, 0 failed.

These results come from the supplied implementation report and have not been independently rerun while preparing this README.

## 13. Production Build

Build the frontend:

```bash
npm run build
```

The supplied implementation report records a successful Vite build with 2,119 modules transformed and output generated in `client/dist`.

This is a previously reported build result, not a guarantee that the current repository or deployment will build successfully without verification.

## 14. Vercel Deployment

LostLink is configured for a Vercel deployment with a frontend build and serverless API handler.

### Step 1: Import the GitHub repository

Open https://vercel.com/new and import:

```text
https://github.com/kiranmayi-ch/LostLink
```

### Step 2: Configure the project

Use the repository root as the Root Directory because `api/`, `server/`, `package.json`, and `vercel.json` are located there.

| Setting | Value |
|---|---|
| Root Directory | Repository root (`./`) |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |
| Install Command | `npm install && npm --prefix client install` |

The install command explicitly installs both root and frontend dependencies. Confirm that the project uses this configuration and that Vite is declared in `client/package.json`.

### Step 3: Configure environment variables

In Vercel, open **Settings → Environment Variables** and configure the variables required by your code:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV
CLIENT_URL
```

Set `MONGODB_URI` to your MongoDB Atlas connection string and use a newly generated random value for `JWT_SECRET`.

Set `JWT_EXPIRES_IN` to `7d` and `NODE_ENV` to `production`.

Set `CLIENT_URL` to the actual deployed website URL.

Never publish connection strings, passwords, or JWT secrets in GitHub.

### Step 4: Verify database access

Ensure your MongoDB Atlas database user, connection string, and network access configuration permit the deployed backend to connect.

The application should fail clearly if the production database is not configured. It should not silently rely on temporary in-memory storage for production data.

### Step 5: Deploy and verify

Deploy the project and inspect the Vercel build logs.

After deployment, test:

- Homepage and frontend navigation.
- User registration and login.
- Report creation and search.
- Matching suggestions.
- Claims and handover workflow.
- User and administrator dashboards.
- Database persistence after refreshing the page.
- `/api/health`, if configured.

A successful frontend build alone does not confirm that the serverless API or database integration works.

## 15. Known Limitations

The supplied implementation report identifies these limitations:

- Direct image uploads are not fully integrated; the current application accepts image URLs.
- Complete multi-institution data isolation is planned for a future update.
- Smart matching suggests possible matches but does not prove ownership.
- External email, SMS, and push notifications are not established by the supplied report.
- Live production behavior must be verified independently.

## 16. Future Enhancements

- Secure cloud image uploads.
- Institution-specific multi-tenancy.
- Enhanced text and image similarity matching.
- Email and push notifications.
- Recovery-rate and resolution-time analytics.
- Additional integration and end-to-end tests.
- Accessibility and localization improvements.
- Production monitoring and deployment checks.

These are proposed enhancements, not claims of existing functionality.

## 17. Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit the changes with a descriptive message.
5. Open a pull request.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

## 18. Academic Project Information

**Project Title:** LostLink — Smart Lost-and-Found Management Platform

**Domain:** Full-stack web development, database management, application security, and workflow automation.

**Target Users:** Students, campus staff, moderators, and administrators.

**Goal:** Improve the efficiency, privacy, and accountability of lost-and-found operations within educational institutions.

## 19. License

The repository currently declares the ISC license in its root `package.json`. Ensure the repository includes the corresponding `LICENSE` file and that the licensing information is consistent before publishing.

---

**LostLink — Making lost-and-found simpler, safer, and more organized.**
