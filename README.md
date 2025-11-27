
# Employee Task Management System

A full-stack web application for managing employees and tasks, featuring authentication, CRUD operations, and per-user sample data. Built with Next.js (React), Express.js, and MongoDB.

---

## Features

- **User Authentication**: Register, login, JWT-based session management
- **Employee Management**: Add, edit, delete, and view employees
- **Task Management**: Assign, update, delete, and track tasks
- **Per-User Sample Data**: New users see demo employees and tasks after registration
- **Role-based Access**: Admin/user roles (extensible)
- **Responsive UI**: Modern design with shadcn and Radix UI components
- **API Integration**: Frontend uses REST API for all data operations

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, shadcn, Radix UI
- **Backend**: Node.js 18+, Express.js, MongoDB (Mongoose ODM)
- **Auth**: JWT, bcrypt
- **Dev Tools**: nodemon, morgan, dotenv

---

## Project Structure

```
├── frontend/
│   ├── app/                # Next.js app directory (pages, layouts, protected routes)
│   ├── components/         # Reusable UI and feature components
│   ├── context/            # React context for auth and data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── styles/             # Global CSS
│   └── ...
├── backend/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic and sample data seeding
│   ├── utils/          # Helper utilities
│   ├── config/         # DB connection
│   └── server.js       # Main server entrypoint
├── .env.local          # Frontend environment config
├── backend/.env        # Backend environment config
├── package.json        # Project dependencies
├── README.md           # Project documentation
```

---

## Setup & Installation

### 1. Clone the repository
```sh
git clone <repo-url>
cd employee-task-management
```

### 2. Install dependencies
```sh
pnpm install
cd backend
npm install
```

### 2.1 Generate PNG icons (optional)
If you'd like to generate PNG icon variants from the project's SVG (`frontend/public/icon.svg`) for apple-touch and favicons, run the included script from the frontend directory:

```powershell
cd frontend
pnpm install # include dev deps (sharp)
npm run generate-icons
```
This will create PNG assets in `frontend/public`. The script attempts to create a `favicon.ico` (if `png-to-ico` or `to-ico` is present), but on some systems you may need to install `png-to-ico` manually or ensure build tools are available. If the `.ico` doesn't appear, you can:

- Run inside the `frontend` folder:

```powershell
# Install `png-to-ico` locally and re-run the script
npm install --save-dev png-to-ico
npm run generate-icons
```

Or use an external or web-based tool to generate a `favicon.ico` from `favicon-16x16.png` and `favicon-32x32.png`.

### 3. Configure environment variables
- **Frontend**: Edit `.env.local` (API base URL)
- **Backend**: Edit `backend/.env` (MongoDB URI, JWT secret, allowed origins)

### 4. Start development servers
- **Backend**:
  ```sh
  cd backend
  npm run dev
  ```
- **Frontend**:
  ```sh
  pnpm dev
  ```

---

## API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/validate` — Validate JWT
- `GET /api/employees` — List employees
- `POST /api/employees` — Add employee
- `PUT /api/employees/:id` — Update employee
- `DELETE /api/employees/:id` — Delete employee
- `GET /api/tasks` — List tasks
- `POST /api/tasks` — Add task
- `PUT /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task

---

## Sample Data
- On registration, each user receives demo employees and tasks for a quick start.

---

## Troubleshooting
- **Port conflicts**: Ensure only one backend server runs on port 5000. Use `npx kill-port 5000` if needed.
- **CORS errors**: Check `FRONTEND_ORIGIN` in backend `.env` and allowed origins in `server.js`.
- **MongoDB connection**: Verify `MONGO_URI` in backend `.env`.

---

## License
MIT


## Author
Rupsa Nanda

---

## Quick Start (Windows)
1. Clone the repository
```powershell
git clone https://github.com/adastra16/PROU-EMS-RUPSA.git
cd ProU-EMS-RUPSA
```

2. Install dependencies
```powershell
# Frontend
cd frontend
pnpm install

# Backend (from root)
cd ..\backend
npm install
```

3. Configure environment variables
- Backend: copy `backend/.env.example` and set values (mongodb URI, JWT secret, frontend origins)
  ```powershell
  cd backend
  copy .env.example .env
  # Edit .env and set MONGO_URI, MONGO_DB_NAME, JWT_SECRET, FRONTEND_ORIGIN
  ```
- Frontend: update `.env.local` (if missing, create it) to set `NEXT_PUBLIC_API_BASE_URL`.
  ```powershell
  cd ..\frontend
  # Create/modify .env.local
  # NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
  ```

4. Start development servers
- Backend:
```powershell
cd backend
npm run dev
```
- Frontend:
```powershell
cd frontend
pnpm dev
```

5. Optional: Seed sample data (backend):
```powershell
cd backend
npm run seed
```

---
### Required environment variables (backend)
- MONGO_URI (e.g., mongodb://127.0.0.1:27017)
- MONGO_DB_NAME
- JWT_SECRET
- FRONTEND_ORIGIN (comma-separated list of allowed frontends)
- PORT (optional, defaults to 5000)

---
### Notes
- Make sure MongoDB is running (local or a managed instance like Atlas). If running locally and you haven’t created a `.env` file, the backend will fall back to `mongodb://127.0.0.1:27017` for development.
- The frontend defaults `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:5000/api` if not set. Update it if your API runs elsewhere.
- If you added or changed configs, and you see CORS issues, verify `FRONTEND_ORIGIN` in the backend `.env` & allowed list in `server.js`.
