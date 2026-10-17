# VulpiCourse — Course Management & Student Scheduling

A MERN-stack MVP where **teachers manage courses** and **students build schedules**.

> Status: **MVP complete** (Milestones 1 and 2).

## Features

- Accounts for two roles, **teacher** and **student**: register, sign in, sign out. Login uses a JWT in an HTTP-only cookie, and passwords are hashed with bcrypt.
- **Course catalog** for everyone, with search by course name or number (partial, case-insensitive) and a details page for each course.
- **Teachers** create courses, and can edit or delete only the courses they created.
- **Students** add courses to their schedule and remove them. **My Schedule** shows the courses plus totals (`4 Courses | 12 Total Credits`).
- All role and ownership rules are enforced by the Express API. The React UI only hides buttons a user can't use.
- Responsive Tailwind UI for desktop and mobile.

### Milestone 1: course management

- Course model with validation (required fields, credits > 0, unique course number).
- Course REST API with clear JSON errors (400/401/403/404/409).
- React pages: catalog, course details, and a shared create/edit form.
- Registration, sign in and sign out with an HTTP-only JWT cookie.
- Teacher-only create, edit and delete, with ownership stored in `createdBy`.

### Milestone 2: student scheduling

- Course search: `GET /api/courses?search=value`.
- Enrollment model (`student` + `course`, unique together).
- Enrollment API: `GET /api/enrollments/me`, `POST /api/enrollments`, `DELETE /api/enrollments/:courseId`. Students only.
- Add to Schedule button on the course page, and a My Schedule page with course count and total credits.
- Removing a course from a schedule deletes only the enrollment; the course stays in the catalog.

## Technology Stack

| Layer    | Tech |
|----------|------|
| Frontend | React, Vite, JavaScript, React Router, Tailwind CSS |
| Backend  | Node.js, Express.js (REST API) |
| Database | MongoDB with Mongoose |
| Auth | JWT in HTTP-only cookies, bcrypt |

Architecture: `React/Vite → Express REST API → Mongoose → MongoDB`

## Folder Structure

```text
course-scheduler/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, CourseCard, CourseForm, SearchBar, ...)
│   │   ├── pages/          # Route-level pages (catalog, details, form, schedule, login, register)
│   │   ├── services/       # API layer: api.js plus auth, course and enrollment services
│   │   ├── context/        # AuthContext / AuthProvider (current user)
│   │   ├── hooks/          # useAuth, useFlashMessage
│   │   ├── utils/          # Small helpers (canManageCourse, inputClass)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
├── server/                 # Express API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # auth, course and enrollment logic
│   ├── middleware/         # protect / authorize, error handler, ObjectId check
│   ├── models/             # User, Course, Enrollment
│   ├── routes/             # /api/auth, /api/courses, /api/enrollments
│   ├── scripts/            # assignCourseOwner.js (one-time migration helper)
│   ├── server.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20+ and npm
- MongoDB, either:
  - **Local**: install [MongoDB Community Server](https://www.mongodb.com/try/download/community), or run it with Docker:
    `docker run -d --name mongo -p 27017:27017 mongo:7`
  - **Cloud**: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (copy its connection string)

## Setup

```bash
git clone https://github.com/kaidesalo/superman-project
cd superman-project
```

### Server

```bash
cd server
npm install
cp .env.example .env      # then edit values
# set JWT_SECRET to a random 32+ character string, e.g.:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev               # http://localhost:5000
```

### Client

```bash
cd client
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

## Environment Variables

`server/.env`

| Variable | Example | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | API port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/course-scheduler` | MongoDB connection string |
| `JWT_SECRET` | random string, 32+ characters | Signs auth tokens. The server won't start with a missing, short, or example value |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | `development` or `production` |

Generate a secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

`client/.env`

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `http://localhost:5000/api` |

Never commit `.env` files — they are in `.gitignore`.

## Verifying the Setup

1. Server terminal shows `MongoDB connected: ...` and `Server running on http://localhost:5000`.
2. `curl http://localhost:5000/api/health` returns `{"status":"ok","database":"connected"}`.
3. Open http://localhost:5173 — the setup check card shows Express API `ok` and MongoDB `connected`.

## Deployment (Render + MongoDB Atlas)

In production one Render web service runs the Express API and also serves the built React app. The site and API share one address, so the login cookie is first-party and works in every browser, including ones that block third-party cookies. `render.yaml` defines the service, and MongoDB Atlas hosts the database.

1. **MongoDB Atlas:** create a free M0 cluster and a database user. Under Network Access, allow `0.0.0.0/0`, because Render's free tier has no fixed IP. Copy the connection string and add the database name: `mongodb+srv://USER:PASS@CLUSTER/course-scheduler`.
2. **Render:** go to New → Blueprint and pick this repo. Render reads `render.yaml` and asks for `MONGODB_URI` (the Atlas connection string). `JWT_SECRET` is generated automatically. `CLIENT_URL` and `VITE_API_URL` are not needed: the client calls `/api` on its own address.
3. **Check the deploy:** `https://vulpicourse-api.onrender.com/api/health` should return `"database":"connected"`, and `https://vulpicourse-api.onrender.com` shows the site.

Notes:
- **Free Render web services sleep** after 15 minutes without traffic. The first request after that takes about a minute.
- **Upgrading from the two-service setup:** delete the old `vulpicourse-client` static site in the Render Dashboard. It no longer works, because the login cookie now only goes to its own address (`SameSite=Lax`).

Auth uses a JWT stored in an HTTP-only `token` cookie (7 days; `SameSite=Lax`, plus `Secure` when `NODE_ENV=production`). The token is never sent in a response body or stored in `localStorage`. Passwords are hashed with bcrypt and never returned by the API. The server refuses to start if `JWT_SECRET` is missing, shorter than 32 characters, or still the `.env.example` placeholder.

**CSRF protection:** in production the client and API can be on different sites, so the cookie uses `SameSite=None` and the browser would send it with requests from any site. To block forged requests, login, register and `GET /api/auth/me` also return a `csrfToken` (an HMAC of the login cookie, see `server/utils/csrf.js`). The client keeps it in memory and sends it in an `X-CSRF-Token` header. `protect` rejects any signed-in POST/PUT/DELETE without a matching header with **403** "Security check failed, please refresh the page and try again". Other sites can't read the token because CORS only allows `CLIENT_URL`.

Anyone can view courses. Creating, editing and deleting require a signed-in teacher, and a teacher can only edit or delete courses they created (`createdBy`). The server enforces this; the UI only hides the buttons.

Schedule actions (`/api/enrollments`) require a signed-in student. The student is always the signed-in user; the API never accepts a student id. Each course can be in a student's schedule only once (unique `student` + `course` index). Removing a course from a schedule deletes only the Enrollment; the course stays in the catalog. When a teacher deletes a course, it is also removed from every schedule.

Courses created before Phase 7 have no owner, so nobody can edit them. Give them to a teacher with:

```bash
cd server && npm run assign-owner -- teacher@example.com
```

Course body fields: `courseName`, `courseNumber`, `description`, `subjectArea`, `credits` (number > 0). `courseNumber` must be unique and is stored uppercase. `createdBy` is set by the server to the signed-in teacher; any value sent by the client is ignored.

Error responses are JSON:

| Status | When | Example body |
|--------|------|--------------|
| 400 | Validation failed | `{"message":"Validation failed","errors":{"credits":"Credits must be greater than zero"}}` |
| 400 | Malformed id or JSON | `{"message":"Invalid id: abc"}` |
| 401 | Not signed in, or session expired | `{"message":"Not signed in"}` |
| 403 | Student tries to change a course | `{"message":"Only teachers can do this"}` |
| 403 | Teacher tries to change another teacher's course | `{"message":"You can only change courses you created"}` |
| 403 | Teacher (or other non-student) uses a schedule endpoint | `{"message":"Only students can do this"}` |
| 404 | Course not found | `{"message":"Course not found"}` |
| 404 | Removing a course that isn't in your schedule | `{"message":"This course is not in your schedule"}` |
| 409 | Course already in your schedule | `{"message":"CSCI 101 is already in your schedule"}` |
| 409 | Duplicate course number | `{"message":"A record with this courseNumber already exists","errors":{"courseNumber":"CSCI 101 is already in use"}}` |

## User Roles

- **teacher** — create, edit, and delete their own courses
- **student** — browse/search courses and manage a personal schedule
