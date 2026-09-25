# SmartTask — Task Manager

A simple, modern, full-stack Task Management web application built with ** JavaScript** (Next.js + Node.js/Express).

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
> Server runs on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
> App runs on: `http://localhost:3000`

---

## 🌟 What This App Does

- **📊 Dashboard**: Live statistics (Total, To Do, In Progress, Completed), recent tasks, top priorities, team workload, and status distribution chart.
- **📋 Task Management**: Create, edit, and filter tasks by status and priority (`Low`, `Medium`, `High`).
- **🔗 Smart Dependencies**: Link tasks together. If Task B depends on Task A, Task B stays **Blocked** until Task A is marked as **Done**.
- **🔐 Task Ownership**: Only the assigned team member can mark a task as **Done** (enforced in both frontend and backend).
- **👥 Team Management**: View team members, their active task counts, and easily switch user profiles to test workflows.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js (REST API)
- **Data Storage**: In-Memory (JavaScript arrays with seed data)
- **Language**: 100% JavaScript (No TypeScript)

---

## 🧠 Core Rules Explained

1. **Smart Dependency Rule**:
   - When Task B depends on Task A, Task B cannot be marked as Done until Task A reaches `Done` status.
   - Once Task A is completed, Task B is automatically unblocked.

2. **Ownership Rule**:
   - A task can **only** be marked as Done by the user it is assigned to.
   - Other users will see the complete button as **Locked**.

---

## 📁 Project Structure

```
smart-task-manager/
├── backend/          # Express REST API & in-memory data
│   └── src/
│       ├── controllers/
│       ├── data/
│       ├── routes/
│       └── server.js
├── frontend/         # Next.js 14 App Router
│   └── src/
│       ├── app/
│       ├── components/
│       ├── context/
│       └── services/
└── README.md
```

---

## 📄 License
MIT License. Open-source for educational and project use.
