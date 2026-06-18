# 🎓 Smart Student Study Planner

A production-ready digital workspace designed for university students to plan study schedules, target syllabus thresholds, manage assignments, monitor exam countdowns, log studied hours, and export academic database requirements.

This project is structured as a premium hybrid application:
1. **Interactive Frontend Dashboard (React 18 + Vite + Tailwind CSS + Framer Motion)** — A client-only experience featuring interactive state handlers, local storage persistence, responsive charts, and elegant micro-animations.
2. **Academic Backend Deliverables Hub (PHP 8 + MySQL Relational Database)** — A formal, hand-crafted set of backend source codes (schema, database connector, session auth, REST API endpoints) designed for local servers such as XAMPP or MAMP, perfectly structured up to **Third Normal Form (3NF)** standards.



## ✨ Outstanding Core Features

### 📊 Academic Dashboard & Subjects Hub
*   **Target GPA Trajectory**: Display current cumulative performance vs target grade objectives.
*   **Subject Directory**: Add custom courses, map specific colors to track individual course metrics, and write target scores.

### 📝 Assignment Priorities & Tasks
*   **Syllabus Topic Checklist**: Organize simple day-to-day work with clear checkbox task lists.
*   **Assignments Ledger**: Track homework weighting, categorize milestones by high-priority sorted indexes, and complete tasks interactively.

### ⏳ Real-Time Exam Countdown & Readiness
*   **Immediate Assessment Ticker**: Counts down to the closest upcoming exam in real-time (Days, Hours, Minutes, Seconds).
*   **Syllabus Readiness Ranges**: Interactive range sliders (0-100%) to visually state preparation status for logged exam papers.

### ⏱️ Dual-Mode Study Timer with Analytics Log
*   **Pomodoro Method**: Pre-set block durations (25-minute study period followed by recovery targets).
*   **Stopwatch Tracker**: Capture open-ended research sections and review hours.
*   **Analytics Exporter**: Clicking "Export to log" parses timed blocks, populates the logging module automatically, and logs values instantly.

### 💾 PHP/MySQL academic Deliverables Hub
*   Directly view, analyze, and copy complete backend architectural codes:
    *   **ERD Constraints**: Explains 3NF cascade deletions, optional subject grouping rules (`SET NULL`), and database indexes.
    *   **schema.sql**: One-click copyable SQL database with 8 interrelated tables and dummy data.
    *   **db.php**: PHP Data Objects (PDO) connector utilizing safe database environments.
    *   **auth.php**: Secure session authentication featuring password salting and `bcrypt` token verification.

---

## 📂 Project Directory Structure

```text
├── index.html                  # Core HTML Web scaffolding
├── package.json                # Project dependencies & development run commands
├── vite.config.ts              # Vite configurations with optimal build steps
├── metadata.json               # Application details and configuration rules
├── .gitignore                  # Prevents committing compiled assets or dependencies
├── src/
│   ├── main.tsx                # Client app entry point
│   ├── index.css               # Global Tailwind CSS configurations with color styling
│   ├── App.tsx                 # Primary state router, navigation view controller, and layout
│   ├── types.ts                # TypeScript interfaces for subjects, sessions, exams, and tasks
│   ├── mockData.ts             # Instantly loads mock academic records on first opening
│   └── components/
│       ├── Dashboard.tsx       # Primary grades summary, custom analytics charts, and statistics
│       ├── SubjectsManager.tsx # Courses lists, GPA targets, and custom color configuration cards
│       ├── TaskOrganizer.tsx   # Core checklist for homework and daily syllabus targets
│       ├── AssignmentsTracker.tsx # Assignments prioritizing table with sorted lists
│       ├── ExamTracker.tsx     # Real-time ticking exam timer and syllabus preparation sliders
│       ├── StudyTimer.tsx      # Comprehensive Pomodoro Clock & Stopwatch integration
│       └── DeliverablesHub.tsx # Copyable PHP codes, schemas, and XAMPP local setup guidelines
└── php_backend/                # Complete PHP / MySQL Deliverables Asset Bundle
    ├── README.md               # Backend-specific installation document
    ├── schema.sql              # Clean SQL database tables and relationships
    ├── db.php                  # Safe PDO database connection framework
    ├── auth.php                # Password verification and user registry routes
    └── api.php                 # JSON RESTful API for fully synced database transactions
```

---

## 🛠️ Step-by-Step GitHub Upload Guide

To upload this complete codebase to your personal **GitHub repository**, follow these clear commands:

### Step 1: Pre-requisites
1. Ensure **Git** is installed on your local computer. If not, download it from [git-scm.com](https://git-scm.com/).
2. Create a free GitHub account on [github.com](https://github.com/).

### Step 2: Initialize Git & Stage project files
Open your local computer's terminal or command prompt inside the project folder and run:
```bash
# Initialize a local Git database inside this directory
git init

# Verify all files are loaded (remains green)
git status

# Stage all files for upload (ignores node_modules according to .gitignore)
git add .

# Save the files locally with a descriptive commit tag
git commit -m "feat: first release of Smart Student Study Planner with PHP MySQL backend"
```

### Step 3: Connect and Push to GitHub
1. Go to **GitHub**, log in, and click the **New** repository button.
2. Enter your repository name (e.g., `smart-study-planner`) and descriptive taglines. Leave "Initialize this repository with..." **UNCHECKED** (do NOT check README or gitignore, since they are already bundled).
3. Click **Create Repository**.
4. Copy the repository URL (it looks like `https://github.com/your-username/smart-study-planner.git`).
5. Run the following commands in your local terminal:
```bash
# Create a primary branch
git branch -M main

# Link your local folder to the newly created GitHub repository
git remote add origin https://github.com/your-username/smart-study-planner.git

# Electronically secure and upload all files
git push -u origin main
```
6. Refresh your GitHub repository page on your browser to view all files, folder directories, and gorgeous setup instructions!

---

## 🔌 Local XAMPP MySQL & Apache Deployment

1. **Move files**: Drop all PHP scripts in the `php_backend` folder right into `C:\xampp\htdocs\study_planner` on your Windows server or `/Applications/XAMPP/htdocs/study_planner` on macOS.
2. **Start Servers**: Boot Apache and MySQL services from your **XAMPP Control Panel**.
3. **Database Import**: Open `http://localhost/phpmyadmin/`, click the **Import** tab, upload `schema.sql`, and click **Go**.
4. **Integration**: Query backend scripts from your client application by building calls to standard API URLs (e.g., `http://localhost/study_planner/api.php?action=get_tasks`).

---

*This Smart Student Study Planner was crafted with aesthetic premium UI layouts, modern client stability, and solid academic programming principles.*
