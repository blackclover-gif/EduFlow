# EduFlow — Learning Management System

EduFlow is a full-stack Learning Management System (LMS) designed to simplify academic management by bringing students, professors, learning resources, attendance, assignments, and assessments into one platform.

The application integrates **Google Gemini AI** to automate quiz generation from course content and uses **JWT-based authentication** to manage protected access for different user roles.

## Features

- **Role-Based Authentication:** Separate access and dashboards for students and professors.
- **Course Management:** Support for organizing courses and academic activities.
- **Lecture Management:** Manage lecture videos and learning resources.
- **Attendance Tracking:** Maintain attendance records for academic activities.
- **Assignment Management:** Support assignment-related academic workflows.
- **AI Quiz Generation:** Generate quizzes and assessments using the Google Gemini API.
- **Quiz Evaluation:** Evaluate quiz attempts and maintain student performance records.
- **RESTful API:** Backend endpoints for application functionality.
- **MongoDB Integration:** Store application data using MongoDB Atlas.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework and API development |
| MongoDB Atlas | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens (JWT) | Authentication and authorization |
| Google Gemini API | AI-powered quiz generation |
| JavaScript | Application logic |

## Architecture

```text
Student / Professor
        |
        v
Role-Based Dashboard
        |
        v
   Express.js API
        |
   +----+----------+
   |               |
JWT Authentication |
   |               |
   +----+----------+
        |
        v
   LMS Modules
        |
   +----+----------+
   |               |
MongoDB Atlas   Gemini API
   |               |
Data Storage    Quiz Generation
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/shivangisingh8419-collab/EduFlow-LMS.git
cd EduFlow-LMS
```

### 2. Install dependencies

```bash
npm install
```

If the project has separate frontend and backend directories, install dependencies in each directory containing a `package.json`.

### 3. Configure environment variables

Create a `.env` file in the directory where the backend reads environment variables.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never commit `.env` to GitHub.

### 4. Run the application

If `server.js` is the backend entry point:

```bash
node server.js
```

If a start script is configured in `package.json`, you can instead run:

```bash
npm start
```

Open the local URL printed by your server. If the backend runs on port `3000`, it will typically be available at `http://localhost:3000`.

## Project Goals

EduFlow aims to reduce manual academic administration, simplify access to learning resources, and
