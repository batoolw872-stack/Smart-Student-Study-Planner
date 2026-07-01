-- ==========================================
-- Smart Student Study Planner Database Schema
-- Target Database: MySQL / MariaDB (Supports InnoDB)
-- ==========================================

CREATE DATABASE IF NOT EXISTS `study_planner`;
USE `study_planner`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `academic_level` VARCHAR(50) DEFAULT 'Undergraduate',
    `academic_major` VARCHAR(100) DEFAULT 'General Studies',
    `gpa_target` DECIMAL(3,2) DEFAULT 4.00,
    `profile_pic` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `color` VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    `credits` INT DEFAULT 3,
    `professor` VARCHAR(100) DEFAULT NULL,
    `location` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_subject` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. STUDY PLANS (GOALS) TABLE
CREATE TABLE IF NOT EXISTS `study_plans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subject_id` INT DEFAULT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `weekly_hours_goal` INT DEFAULT 5,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_plan` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subject_id` INT DEFAULT NULL,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'General', -- e.g., Homework, Revision, Project, Administrative
    `priority` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    `due_date` DATE DEFAULT NULL,
    `is_completed` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_tasks` (`user_id`, `is_completed`),
    INDEX `idx_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS `assignments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `due_date` DATETIME NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    `status` ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    `grade_weight` INT DEFAULT NULL, -- Percentage weight in course
    `remind_before_hours` INT DEFAULT 24,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_assignments` (`user_id`),
    INDEX `idx_assignment_due` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EXAMS TABLE
CREATE TABLE IF NOT EXISTS `exams` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `exam_date` DATETIME NOT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `preparation_progress` INT DEFAULT 0, -- 0 to 100 percentage
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_exams` (`user_id`),
    INDEX `idx_exam_date` (`exam_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. STUDY SESSIONS (HEALTH & HOURS LOGS) TABLE
CREATE TABLE IF NOT EXISTS `study_sessions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `subject_id` INT DEFAULT NULL,
    `duration_minutes` INT NOT NULL, -- duration of study session
    `session_date` DATETIME NOT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_sessions` (`user_id`),
    INDEX `idx_session_date` (`session_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'General', -- e.g., Reminder, Deadline, System
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_notifications` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- SEED INITIAL MOCK DATA FOR DEMONSTRATION
-- ==========================================

-- Insert a default demo user (password hash is for 'student123')
INSERT INTO `users` (`id`, `name`, `email`, `password`, `academic_level`, `academic_major`, `gpa_target`)
VALUES (1, 'Alex Mercer', 'demo@student.edu', '$2y$10$UnN/oUv7g7Q4c8N.6gqG/O82k1nSg/b2cIeN5A.8JzNpe6G90K9I.', 'Undergraduate', 'Computer Science & Engineering', 3.85);

-- Insert initial subjects for the user
INSERT INTO `subjects` (`id`, `user_id`, `code`, `name`, `color`, `credits`, `professor`, `location`) VALUES
(1, 1, 'CS-301', 'Database Systems', '#3B82F6', 4, 'Dr. Emily Watson', 'Engineering Hall 401'),
(2, 1, 'CS-302', 'Software Design Patterns', '#10B981', 3, 'Prof. Robert Lin', 'Science Center B10'),
(3, 1, 'MATH-250', 'Linear Algebra', '#F59E0B', 3, 'Dr. Sarah Jenkins', 'Mathematics Dept 102'),
(4, 1, 'HSS-105', 'Technical Writing', '#EC4899', 2, 'Prof. Anna Geller', 'Humanities Bldg 305');

-- Insert initial study plans
INSERT INTO `study_plans` (`id`, `user_id`, `subject_id`, `title`, `description`, `weekly_hours_goal`, `start_date`, `end_date`) VALUES
(1, 1, 1, 'Master SQL and Schema Design', 'Complete all lecture exercises, focus on joining tables and optimization strategies.', 6, '2026-06-01', '2026-07-15'),
(2, 1, 2, 'Design Pattern Projects', 'Build a small sample application implementing MVC, Observer, and Singleton patterns.', 4, '2026-06-01', '2026-06-30');

-- Insert initial tasks
INSERT INTO `tasks` (`id`, `user_id`, `subject_id`, `title`, `category`, `priority`, `due_date`, `is_completed`) VALUES
(1, 1, 1, 'Draft ER diagram for final project', 'Homework', 'High', '2026-06-15', 0),
(2, 1, 3, 'Complete Linear Algebra Chapter 4 Homework', 'Homework', 'Medium', '2026-06-18', 0),
(3, 1, 4, 'Submit resume draft and business letter', 'Revision', 'Low', '2026-06-20', 1),
(4, 1, 2, 'Read Chapter 5: Factory Patterns', 'Study', 'Medium', '2026-06-16', 0);

-- Insert initial assignments
INSERT INTO `assignments` (`id`, `user_id`, `subject_id`, `title`, `description`, `due_date`, `priority`, `status`, `grade_weight`) VALUES
(1, 1, 1, 'Normalization Practice Assignment', 'Normalize a set of raw database schemas into 1NF, 2NF, and 3NF with step-by-step explanations.', '2026-06-17 23:59:00', 'High', 'Pending', 10),
(2, 1, 2, 'Design Pattern Mini-Project', 'Write a Java console chat application leveraging Observer and Commmand patterns.', '2026-06-22 18:00:00', 'High', 'In Progress', 15),
(3, 1, 3, 'Matrix Transformation Worksheet', 'Verify properties of linear maps, kernels, and vector spans.', '2026-06-19 12:00:00', 'Medium', 'Pending', 5);

-- Insert initial exam schedules
INSERT INTO `exams` (`id`, `user_id`, `subject_id`, `title`, `exam_date`, `location`, `preparation_progress`) VALUES
(1, 1, 1, 'Midterm Exam - Lectures 1 to 10', '2026-06-25 10:00:00', 'Main Gym, Hall B', 45),
(2, 1, 3, 'Linear Algebra Final Exam', '2026-06-30 08:30:00', 'Math Wing, Class 2-A', 20);

-- Insert initial study sessions (to populate charts initially)
INSERT INTO `study_sessions` (`id`, `user_id`, `subject_id`, `duration_minutes`, `session_date`, `notes`) VALUES
(1, 1, 1, 120, '2026-06-08 14:00:00', 'Reviewed SQL joins and index types'),
(2, 1, 2, 90, '2026-06-09 10:30:00', 'Worked on Factory pattern code'),
(3, 1, 3, 60, '2026-06-10 16:00:00', 'Linear algebra vector spaces review'),
(4, 1, 1, 150, '2026-06-11 19:00:00', 'Normalization proofs practice'),
(5, 1, 4, 45, '2026-06-11 11:30:00', 'Drafted and proofread technical edit');

-- Insert notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`) VALUES
(1, 1, 'Assignment Deadline', 'Your Normalization Practice Assignment is due in 5 days!', 'Deadline'),
(2, 1, 'Exam Alert', 'Midterm Exam for Database Systems is approaching in 13 days!', 'Exam'),
(3, 1, 'Study Streak', 'Awesome! You studied 195 minutes yesterday. Keep up the momentum!', 'Reminder');
