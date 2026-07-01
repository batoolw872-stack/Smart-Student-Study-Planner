# Smart Student Study Planner - PHP/MySQL Backend Setup Guide

This directory contains the production-ready PHP and MySQL backend architecture for the Smart Student Study Planner. It includes standard secure programming designs, prepared statements with PHP manual input sanitization, and full relational constraints.

## 📁 Included Files
1. `schema.sql` : The complete database schema with tables, constraints, keys, indexes, and full demonstration seed data.
2. `db.php` : Secure database driver file utilizing PHP PDO.
3. `auth.php` : Secure student registration, password hashing (bcrypt), login session management, and validation routines.
4. `api.php` : Restful JSON endpoints to perform CRUD actions for subjects, tasks, goals, exam countdowns, and study sessions.

---

## 🛠️ Step-by-Step Installation Instructions

### Method 1: Local Development environment using XAMPP (Windows/macOS)

1. **Download & Install XAMPP**:
   - Go to [apachefriends.org](https://www.apachefriends.org/) and download XAMPP for your platform (Windows, macOS, or Linux).
   - Install with Apache and MySQL selected.

2. **Move files to Server Directory**:
   - Locate your local webroot folder:
     - On Windows: `C:\xampp\htdocs\`
     - On macOS: `/Applications/XAMPP/htdocs/`
   - Create a subfolder names `study_planner` (e.g., `C:\xampp\htdocs\study_planner\`).
   - Copy all PHP and SQL files from this bundle into that folder.

3. **Start Local Services**:
   - Open the **XAMPP Control Panel**.
   - Click **Start** beside **Apache**.
   - Click **Start** beside **MySQL**.

4. **Import Database Schema**:
   - Open your web browser and navigate to `http://localhost/phpmyadmin/`.
   - Click on the **Import** tab at the top.
   - Click **Choose File** and select the `/php_backend/schema.sql` file.
   - Scroll to the bottom and click **Go** or **Import**.
   - A database named `study_planner` will be created automatically with all 8 tables and fully configured relationships.

5. **Test Web Application Endpoints**:
   - Navigate to `http://localhost/study_planner/db.php` to verify database drivers are loaded. If it displays a blank page or secure connection successful notes, it is configured correctly!
   - To integrate with a frontend, build your fetch requests targeting `http://localhost/study_planner/api.php?action=...`

---

## 🗺️ Architectural ER Diagram Description

Our database is fully normalized (up to Third Normal Form - 3NF). It prevents redundancy and guarantees data integrity.

### Table Relationships
- **users** (`1`) <---> (`0..*`) **subjects**: Each user organizes multiple subjects. Removing a user cascades to remove all associated subjects.
- **users** (`1`) <---> (`0..*`) **tasks**: Tasks are linked to users. Optional `subject_id` allows users to index a task to a course or group it globally (`SET NULL` on delete).
- **users** (`1`) <---> (`0..*`) **assignments**: Assignments must link to a user and a valid course `subject_id` to ensure correct grade calculations.
- **users** (`1`) <---> (`0..*`) **exams**: Track Exam schedules per course.
- **users** (`1`) <---> (`0..*`) **study_sessions**: Records cumulative study durations, used to plot historical charts.
- **users** (`1`) <---> (`0..*`) **notifications**: Alert alerts, flags, and warnings.
