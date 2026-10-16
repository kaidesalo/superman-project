# VulpiCourse — Course Management & Student Scheduling

A MERN-stack MVP where **teachers manage courses** and **students build schedules**.

> Status: **Milestone 1, Phase 3** — Course model and REST API complete. React pages, auth, and scheduling are coming in later phases.

## Technology Stack

| Layer    | Tech |
|----------|------|
| Frontend | React, Vite, JavaScript, React Router, Tailwind CSS |
| Backend  | Node.js, Express.js (REST API) |
| Database | MongoDB with Mongoose |
| Auth (planned) | JWT in HTTP-only cookies, bcrypt |

Architecture: `React/Vite → Express REST API → Mongoose → MongoDB`

## Folder Structure

```text
course-scheduler/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API layer (api.js)
│   │   ├── context/        # React context (auth, later)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
├── server/                 # Express API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
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
git clone <your-repo-url>
cd course-scheduler
```

### Server

```bash
cd server
npm install
cp .env.example .env      # then edit values
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
| `JWT_SECRET` | long random string | Signs auth tokens (used from Phase 6) |
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

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | API + database status |
| GET | `/api/courses` | List all courses (sorted by course number) |
| GET | `/api/courses/:id` | Get one course |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/:id` | Update a course (send only the fields to change) |
| DELETE | `/api/courses/:id` | Delete a course |

> Course routes are not protected yet — teacher-only access and ownership checks arrive in Phase 7.

Course body fields: `courseName`, `courseNumber`, `description`, `subjectArea`, `credits` (number > 0). `courseNumber` must be unique and is stored uppercase. Any `createdBy` sent by the client is ignored.

Error responses are JSON:

| Status | When | Example body |
|--------|------|--------------|
| 400 | Validation failed | `{"message":"Validation failed","errors":{"credits":"Credits must be greater than zero"}}` |
| 400 | Malformed id or JSON | `{"message":"Invalid id: abc"}` |
| 404 | Course not found | `{"message":"Course not found"}` |
| 409 | Duplicate course number | `{"message":"A record with this courseNumber already exists","errors":{"courseNumber":"CSCI 101 is already in use"}}` |

## User Roles (planned)

- **teacher** — create, edit, and delete their own courses
- **student** — browse/search courses and manage a personal schedule
