# TransitOps 

![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![Express.js](https://img.shields.io/badge/Express.js-Framework-lightgrey) ![React](https://img.shields.io/badge/React-Frontend-blue) ![Vite](https://img.shields.io/badge/Vite-Bundler-purple) ![Supabase](https://img.shields.io/badge/Supabase-Database-success)

TransitOps is a comprehensive transit operations management system. This base repository includes a robust backend built with Node.js/Express and a modern, fast frontend powered by React and Vite.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Supabase](https://supabase.com/) account for the database

---

## 🚀 Getting Started

### 1. Backend Setup

The backend handles the core API logic, authentication, and database connections.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will typically run on `http://localhost:5000`.*

### 2. Database Setup

To set up the initial database schema:
1. Go to your Supabase project dashboard.
2. Open the **SQL Editor**.
3. Run the SQL script located in `backend/migrations/001_users.sql` to create the initial `users` table.

### 3. Frontend Setup

The frontend is a React application built with Vite for optimal performance and developer experience.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and configure the backend URL to point to your local backend instance.
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   *The app will usually be accessible at `http://localhost:5173`.*

---

##  Next Steps & Contributing

This is the foundation! Teammates can clone or pull this repository and start building additional features such as:
- **Vehicles Management** 
- **Drivers & Staffing** 
- **Trip Scheduling** 
- **Maintenance Tracking** 

Happy coding! 
