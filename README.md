# Team Task Manager

<img width="1383" height="692" alt="image" src="https://github.com/user-attachments/assets/42193447-388e-42b7-8f48-2d3048e007bf" />
<img width="1434" height="798" alt="image" src="https://github.com/user-attachments/assets/833b820e-884f-45b7-9fb3-148bc352881f" />

<img width="1889" height="875" alt="image" src="https://github.com/user-attachments/assets/e998f800-4474-42e1-b94c-a251265aa238" />

---

**Project Brief:** This is a submission for **Exercise 1: Personal Task Manager**.

While the core requirement was to build a single-user personal task list, I chose to extend the scope to demonstrate a more complete full-stack architecture. This application is a collaborative Team Task Manager that includes authentication, Role-Based Access Control (Admin vs. Member), project grouping, and a real-time analytics dashboard, while fully satisfying all "Must Have" and "Should Have" requirements of the original brief (CRUD operations, status filtering, and overdue task tracking).

---

## 🔗 Live Demo Links

- **Full Application:** [Click Here](https://team-task-manager-client.onrender.com)

  
- **Frontend Application:** [Click Here](https://team-task-manager-client.onrender.com)
- **Backend API:** [Click Here](https://team-task-manager-api-c5rt.onrender.com)

> Note: The backend is hosted on a free tier and may take 30–50 seconds to spin up on the first request.

---

## ✨ Features

- **Authentication & RBAC:** Secure JWT login. Admins can create projects, tasks, and delete records. Members can view tasks and update statuses.
- **Task Management:** Create, view, update, and delete tasks with assigned due dates and priorities.
- **Status Filtering:** Quickly filter tasks by `All`, `Active`, and `Completed`.
- **Dashboard Analytics:** Live counts of total, pending, completed, and overdue tasks, plus a breakdown of tasks per team member.
- **Project Organization:** Group tasks into specific projects.
- **Responsive UI:** Clean, modern interface built with Tailwind CSS that works seamlessly across desktop and mobile devices.

---

## 🛠️ Tech Stack & Decisions

- **Frontend:** React (Vite) + Tailwind CSS  
  Chosen for fast development, modern hot-module reloading, and utility-first styling.

- **Backend:** Node.js with Express  
  Lightweight and ideal for building RESTful APIs.

- **Database:** MongoDB (Mongoose)  
  Flexible schema design for Users, Projects, and Tasks.

- **Authentication:** JWT + bcrypt  
  Secure stateless authentication and password hashing.

---

## 📸 Screenshots

### Admin Dashboard & Analytics
<img width="1888" height="885" alt="image" src="https://github.com/user-attachments/assets/e81c3a82-55e4-476b-9655-40c881b41c12" />


### Task Filtering & Status Updates
<img width="1617" height="323" alt="image" src="https://github.com/user-attachments/assets/6d0974bb-fec6-489a-9275-059516928a75" />
<img width="1617" height="233" alt="image" src="https://github.com/user-attachments/assets/8b72b636-7d08-4eca-ad24-fc0fe73df11b" />
<img width="1604" height="254" alt="image" src="https://github.com/user-attachments/assets/eac31593-fdce-4e04-b230-e4e90fb17ae6" />


### Member Dashboard & Analytics
<img width="1908" height="845" alt="image" src="https://github.com/user-attachments/assets/a7dc3639-37a7-4361-9cb3-db28281df9af" />


---

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB connection (Local or Atlas)

---

### Backend Setup

```bash
  cd backend
  npm install
```

---

## 📌 Project Setup Guide

### Backend Setup

Create `.env` file:

  - PORT=5000 

  - MONGO_URI=your_mongodb_connection_string

  - JWT_SECRET=your_super_secret_key


### Install dependencies and start backend:

  - npm install
  - npm start


---

### Frontend Setup

  - cd frontend
  - npm install

Create `.env` file:

  - VITE_API_URL=http://localhost:5000

Start frontend:

  - npm run dev


---

## 📚 API Documentation

### Auth Routes

Method | Endpoint | Description
------ | -------- | -----------
POST | /api/auth/register | Register user
POST | /api/auth/login | Login user


---

### Task Routes (Requires Token)

Method | Endpoint | Description
------ | -------- | -----------
GET | /api/tasks | Get all tasks
POST | /api/tasks | Create task
PUT | /api/tasks/:id | Update task
PATCH | /api/tasks/:id/status | Update status
DELETE | /api/tasks/:id | Delete task
GET | /api/tasks/stats | Get dashboard stats


---

### Project Routes (Requires Token)

Method | Endpoint | Description
------ | -------- | -----------
GET | /api/projects | Get projects
POST | /api/projects | Create project
DELETE | /api/projects/:id | Delete project


---

## 📂 Project Structure

<img width="636" height="367" alt="image" src="https://github.com/user-attachments/assets/cef804a9-000b-4685-8a09-c57a076e584a" />
