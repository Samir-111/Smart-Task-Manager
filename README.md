# SmartTask — Task Manager

A full-stack task management web application built with Next.js (React) and Node.js (Express). It allows users to create, assign, track, and manage task workflows with in-memory state and dependency validation.

## Features

- **Task Management**: Create, edit, delete, and filter tasks by status and priority (Low, Medium, High).
- **Task Dependencies**: Link dependent tasks together. If Task B depends on Task A, Task B cannot be completed until Task A is Done.
- **Task Ownership & Mock Auth**: Only the assigned user can mark a task as completed. Switch between user profiles to test workflows.
- **Task Comments**: Add discussions and notes directly on task detail views.
- **Data Export**: Export filtered tasks to CSV format with a single click.
- **Dark Mode Support**: Light and Dark theme toggle with persistence.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js (REST API)
- **Database**: In-Memory (JavaScript store)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### 1. Run the Backend

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start on `http://localhost:3000`.

## API Endpoints

### Users
- `GET /api/users` - Get all users with assigned task count
- `POST /api/users` - Create a new user
- `POST /api/users/login` - Mock user login

### Tasks
- `GET /api/tasks` - Get all tasks (supports `?status=` and `?priority=` filters)
- `GET /api/tasks/:id` - Get task details by ID
- `GET /api/tasks/my/:userId` - Get tasks assigned to a specific user
- `GET /api/tasks/blocked` - Get all blocked tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/complete` - Mark a task as completed
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/    # Request handlers and business logic
│       ├── data/           # In-memory mock data
│       ├── routes/         # Express API routes
│       └── server.js       # Server entry point
├── frontend/
│   └── src/
│       ├── app/            # Next.js App Router pages
│       ├── components/     # UI components
│       ├── context/        # React context (Auth, Theme)
│       ├── services/       # API client service
│       └── utils/          # Helpers (CSV export, confetti)
└── README.md
```

## License

This project is open-source and available under the MIT License.

