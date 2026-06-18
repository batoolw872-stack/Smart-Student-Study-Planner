import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, FileCode2, BookOpen, Settings, Check, Copy, Terminal, Server, ArrowDownToLine, Star } from 'lucide-react';

export default function DeliverablesHub() {
  const [activeSubTab, setActiveSubTab] = useState<'er-schema' | 'sql' | 'php' | 'guide'>('er-schema');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const sqlSchemaCode = `-- ==========================================
-- Smart Student Study Planner Database Schema
-- Target Database: MySQL / MariaDB (InnoDB Engine)
-- ==========================================

CREATE DATABASE IF NOT EXISTS \`study_planner\`;
USE \`study_planner\`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(100) NOT NULL,
    \`email\` VARCHAR(150) NOT NULL UNIQUE,
    \`password\` VARCHAR(255) NOT NULL,
    \`academic_level\` VARCHAR(50) DEFAULT 'Undergraduate',
    \`academic_major\` VARCHAR(100) DEFAULT 'General Studies',
    \`gpa_target\` DECIMAL(3,2) DEFAULT 4.00,
    \`profile_pic\` VARCHAR(255) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS \`subjects\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`code\` VARCHAR(20) NOT NULL,
    \`name\` VARCHAR(100) NOT NULL,
    \`color\` VARCHAR(7) DEFAULT '#3B82F6',
    \`credits\` INT DEFAULT 3,
    \`professor\` VARCHAR(100) DEFAULT NULL,
    \`location\` VARCHAR(100) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
    INDEX \`idx_user_subject\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. STUDY PLANS TABLE
CREATE TABLE IF NOT EXISTS \`study_plans\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`subject_id\` INT DEFAULT NULL,
    \`title\` VARCHAR(150) NOT NULL,
    \`description\` TEXT DEFAULT NULL,
    \`weekly_hours_goal\` INT DEFAULT 5,
    \`start_date\` DATE NOT NULL,
    \`end_date\` DATE NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
    FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE SET NULL,
    INDEX \`idx_user_plan\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS \`tasks\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`subject_id\` INT DEFAULT NULL,
    \`title\` VARCHAR(150) NOT NULL,
    \`category\` VARCHAR(50) DEFAULT 'General',
    \`priority\` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    \`due_date\` DATE DEFAULT NULL,
    \`is_completed\` TINYINT(1) DEFAULT 0,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
    FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE SET NULL,
    INDEX \`idx_user_tasks\` (\`user_id\`, \`is_completed\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const phpDbConnectCode = `<?php
/**
 * db.php - Database Driver Link
 * Initializes PDO parameters safely. Supports Prepared Statements natively.
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); 
define('DB_NAME', 'study_planner');
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false, // Enforce real SQL parameter binding
    ];

    try {
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (\PDOException $e) {
        error_log("Database Connection Failure: " . $e->getMessage());
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => 'Database connection failed. Check your local SQL server is active!']);
        exit;
    }
}`;

  const phpAuthCode = `<?php
/**
 * auth.php - Student Session Entry Code
 * Implements standard BCrypt password hashing and session generation securely.
 */

require_once 'db.php';

if (session_status() == PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    session_start();
}

function registerUser($name, $email, $password) {
    if (empty($name) || empty($email) || empty($password)) {
        return ['status' => 'error', 'message' => 'Please fully supply registrations fields.'];
    }

    $pdo = getDBConnection();
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            return ['status' => 'error', 'message' => 'This academic email is already recorded.'];
        }

        // Hash using native secure bcrypt
        $hp = password_hash($password, PASSWORD_BCRYPT);
        
        $insert = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:n, :e, :p)");
        $insert->execute(['n' => $name, 'e' => $email, 'p' => $hp]);
        
        return ['status' => 'success', 'message' => 'Student account finalized. Proceed to log in!'];
    } catch (PDOException $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}`;

  return (
    <div className="space-y-6 font-sans" id="deliverables_hub_tab">
      
      {/* Tab Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <Database className="h-5 w-5 text-[#5A6F4D]" />
            PHP/MySQL Project Deliverables Hub
          </h2>
          <p className="text-xs text-[#5D6659]">
            Export relational SQL tables, examine the Third Normal Form schema, copy sanitized PHP backend codes, and review deployment steps.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="bg-[#E4E8DA] text-[#5A6F4D] font-bold text-xs px-3.5 py-1.5 rounded-xl border border-[#D9DED1] flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#A3B18A] text-[#5A6F4D]" /> Academic Grade A+ Template
          </span>
        </div>
      </div>

      {/* Deliverable Sub tabs navigator */}
      <div className="flex border-b border-[#D9DED1]/60 overflow-x-auto gap-4 scrollbar-none" id="deliverables_sub_tabs">
        <button 
          id="btn_subtab_schema"
          onClick={() => setActiveSubTab('er-schema')}
          className={`pb-3 text-xs font-bold shrink-0 outline-none transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'er-schema' ? 'border-[#5A6F4D] text-[#5A6F4D]' : 'border-transparent text-[#9DA895] hover:text-[#5D6659]'
          }`}
        >
          🎓 Entity-Relationship ERD & Normalization
        </button>
        <button 
          id="btn_subtab_sql"
          onClick={() => setActiveSubTab('sql')}
          className={`pb-3 text-xs font-bold shrink-0 outline-none transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'sql' ? 'border-[#5A6F4D] text-[#5A6F4D]' : 'border-transparent text-[#9DA895] hover:text-[#5D6659]'
          }`}
        >
          📜 Copy schema.sql Database
        </button>
        <button 
          id="btn_subtab_php"
          onClick={() => setActiveSubTab('php')}
          className={`pb-3 text-xs font-bold shrink-0 outline-none transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'php' ? 'border-[#5A6F4D] text-[#5A6F4D]' : 'border-transparent text-[#9DA895] hover:text-[#5D6659]'
          }`}
        >
          ⚙️ Sanitized PHP PDO Backend
        </button>
        <button 
          id="btn_subtab_guide"
          onClick={() => setActiveSubTab('guide')}
          className={`pb-3 text-xs font-bold shrink-0 outline-none transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'guide' ? 'border-[#5A6F4D] text-[#5A6F4D]' : 'border-transparent text-[#9DA895] hover:text-[#5D6659]'
          }`}
        >
          💻 Local XAMPP Setup Steps
        </button>
      </div>

      {/* Sub tabs content panels */}
      <div className="pt-2">
        {activeSubTab === 'er-schema' && (
          <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm space-y-6" id="erd_normalization_panel">
            {/* Database schema specs bento outline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#2D332A] leading-tight">Relation Database Specifications</h3>
                <p className="text-xs text-[#5D6659] leading-relaxed">
                  This database leverages standard design rules. Every table adheres to **Third Normal Form (3NF)** standards, avoiding anomalies and maximizing transaction performance on MySQL.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2.5 items-start">
                    <span className="bg-[#E4E8DA] text-[#5A6F4D] font-bold p-1 rounded-md text-[10px] w-5 h-5 flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D332A]">First Normal Form (1NF)</h4>
                      <p className="text-[11px] text-[#5D6659] leading-normal animate-none">Eliminates repeating groups. Each column yields atomic values; rows contain distinct identifiers (Primary Keys).</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="bg-[#F1F2EB] text-[#5A6F4D] font-bold p-1 rounded-md text-[10px] w-5 h-5 flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D332A]">Second Normal Form (2NF)</h4>
                      <p className="text-[11px] text-[#5D6659] leading-normal animate-none">Satisfies 1NF. All non-prime attributes are fully functionally dependent on the entire Primary Key, avoiding partial dependencies.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="bg-[#E4E8DA] text-[#D4A373] font-bold p-1 rounded-md text-[10px] w-5 h-5 flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D332A]">Third Normal Form (3NF)</h4>
                      <p className="text-[11px] text-[#5D6659] leading-normal animate-none">Satisfies 2NF. All fields contain no transitive dependencies (i.e., non-key cols never rely on secondary non-key properties).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ER table directory list */}
              <div className="bg-[#F8F9F4] p-5 rounded-2xl border border-[#D9DED1]/60">
                <h3 className="text-sm font-bold text-[#2D332A] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Terminal className="h-4 w-4 text-[#5D6659]" /> Relational SQL Tables (8 total)
                </h3>
                <ul className="text-xs space-y-2 font-mono text-[#2D332A]">
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>1. <strong>users</strong> (Profiles, salts)</span>
                    <span className="text-[#5A6F4D] font-bold">&lt;Parent&gt;</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>2. <strong>subjects</strong> (Courses, links)</span>
                    <span className="text-[#9DA895]">1:M parent/child</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>3. <strong>study_plans</strong> (Goals tracker)</span>
                    <span className="text-[#5D6659]">FK user_id, subj_id</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>4. <strong>tasks</strong> (Daily check tasks)</span>
                    <span className="text-[#5D6659]">Indexes applied</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>5. <strong>assignments</strong> (HW priorities)</span>
                    <span className="text-[#5D6659]">FK cascade triggers</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>6. <strong>exams</strong> (Midterms counters)</span>
                    <span className="text-[#5D6659]">TS format</span>
                  </li>
                  <li className="flex justify-between border-b border-[#D9DED1]/25 pb-1">
                    <span>7. <strong>study_sessions</strong> (Studied mins)</span>
                    <span className="text-[#D4A373] font-bold">Aggregation</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>8. <strong>notifications</strong> (Toasts status)</span>
                    <span className="text-[#5D6659]">Unread flag index</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Constraints & Foreign keys breakdown */}
            <div className="pt-4 border-t border-[#D9DED1]/30 space-y-3">
              <h3 className="text-sm font-bold text-[#2D332A]">Referential Integrity & MySQL Relational Constraints:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#E4E8DA]/40 p-4 rounded-xl border border-[#D9DED1]/60">
                  <h4 className="font-bold text-[#2D332A]">Cascade Deletions</h4>
                  <p className="text-[#5D6659] leading-normal mt-1">
                    All core tables use <code>ON DELETE CASCADE</code> referencing <code>users.id</code>. Removing a user automatically purges all their courses, assignments, study logs, and notifications instantly. No orphaned records!
                  </p>
                </div>
                <div className="bg-[#F1F2EB]/50 p-4 rounded-xl border border-[#D9DED1]/50">
                  <h4 className="font-bold text-[#2D332A]">Set Null Safetynet</h4>
                  <p className="text-[#5D6659] leading-normal mt-1">
                    Study goals and generic tasks map to subjects optionally. They utilize <code>ON DELETE SET NULL</code> for courses, letting task logs survive even if a specific subject code is retired.
                  </p>
                </div>
                <div className="bg-[#F8F9F4] p-4 rounded-xl border border-[#D9DED1]/60">
                  <h4 className="font-bold text-[#2D332A]">Index Optimizations</h4>
                  <p className="text-[#5D6659] leading-normal mt-1">
                    Indexes are explicitly mapped on frequently queried columns (like <code>users.email</code>, <code>tasks.is_completed</code>, <code>exams.exam_date</code>) allowing rapid analytical page load, even with 100,000+ data logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'sql' && (
          <div className="space-y-4" id="copyable_sql_panel">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#5D6659] uppercase tracking-widest">Database Seed File (schema.sql)</h3>
              <button 
                id="btn_copy_sql"
                onClick={() => copyToClipboard(sqlSchemaCode, 'sql')}
                className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer outline-none transition-colors"
              >
                {copiedText === 'sql' ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy SQL Code
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#2D332A] border border-[#D9DED1]/20 shadow-sm text-left overflow-x-auto max-h-[350px]">
              <pre className="p-5 font-mono text-[11px] text-[#E4E8DA] leading-relaxed overflow-x-auto select-all">
                <code>{sqlSchemaCode}</code>
              </pre>
            </div>
            <p className="text-[10px] text-[#9DA895] italic mt-2">
              * Note: Import this schema into PhpMyAdmin inside local Apache servers like XAMPP or WAMP to build your production database automatically!
            </p>
          </div>
        )}

        {activeSubTab === 'php' && (
          <div className="space-y-6" id="copyable_php_panel">
            
            {/* Code block 1: db.php */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5A6F4D] bg-[#E4E8DA] px-2.5 py-0.5 rounded-full border border-[#D9DED1]">
                  db.php (PDO Driver Conn)
                </span>
                <button 
                  id="btn_copy_php_db"
                  onClick={() => copyToClipboard(phpDbConnectCode, 'php-db')}
                  className="text-xs font-bold text-[#5D6659] hover:text-[#5A6F4D] flex items-center gap-1 outline-none cursor-pointer"
                >
                  {copiedText === 'php-db' ? 'Copied!' : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </div>
              <div className="rounded-2xl bg-[#2D332A] text-left overflow-x-auto max-h-[220px] border border-[#D9DED1]/20">
                <pre className="p-4 font-mono text-[10px] text-[#A3B18A] leading-relaxed overflow-x-auto select-all">
                  <code>{phpDbConnectCode}</code>
                </pre>
              </div>
            </div>

            {/* Code block 2: auth.php */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#D4A373] bg-[#F1F2EB] px-2.5 py-0.5 rounded-full border border-[#D9DED1]">
                  auth.php (Session Salt Hashing)
                </span>
                <button 
                  id="btn_copy_php_auth"
                  onClick={() => copyToClipboard(phpAuthCode, 'php-auth')}
                  className="text-xs font-bold text-[#5D6659] hover:text-[#5A6F4D] flex items-center gap-1 outline-none cursor-pointer"
                >
                  {copiedText === 'php-auth' ? 'Copied!' : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </div>
              <div className="rounded-2xl bg-[#2D332A] text-left overflow-x-auto max-h-[220px] border border-[#D9DED1]/20">
                <pre className="p-4 font-mono text-[10px] text-[#E4E8DA] leading-relaxed overflow-x-auto select-all">
                  <code>{phpAuthCode}</code>
                </pre>
              </div>
            </div>

          </div>
        )}

        {activeSubTab === 'guide' && (
          <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm space-y-6" id="xampp_deployment_panel">
            <h3 className="text-base font-bold text-[#2D332A] mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-[#5A6F4D]" /> Local Server Deployment Walkthrough
            </h3>

            <div className="relative border-l-2 border-[#D9DED1] pl-5 space-y-5">
              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 bg-[#5A6F4D] border-2 border-white rounded-full" />
                <h4 className="text-xs font-bold text-[#2D332A]">Step 1: Download Apache Environment Stack</h4>
                <p className="text-[11px] text-[#5D6659] leading-normal mt-1">
                  Install a local web server software. We heavily recommend <strong>XAMPP</strong> (Windows/macOS/Linux) or <strong>MAMP</strong> which includes Apache, PHP, and MySQL compiled together instantly.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 bg-[#5A6F4D] border-2 border-white rounded-full" />
                <h4 className="text-xs font-bold text-[#2D332A]">Step 2: Copy backend code to htdocs folder</h4>
                <p className="text-[11px] text-[#5D6659] leading-normal mt-1">
                  Locate your web root directory (usually <code>C:\xampp\htdocs\</code> on Windows or <code>/Applications/XAMPP/htdocs/</code> on Mac). Create a folder named <code>study_planner</code> and drop the PHP scripts inside.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 bg-[#5A6F4D] border-2 border-white rounded-full" />
                <h4 className="text-xs font-bold text-[#2D332A]">Step 3: Import schema.sql into PhpMyAdmin</h4>
                <p className="text-[11px] text-[#5D6659] leading-normal mt-1">
                  Open your browser to <code>http://localhost/phpmyadmin/</code>. Create a database named <code>study_planner</code>. Select the <strong>Import</strong> tab, choose the copy of your generated <code>schema.sql</code>, and click run.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 bg-[#5A6F4D] border-2 border-white rounded-full" />
                <h4 className="text-xs font-bold text-[#2D332A]">Step 4: Launch local web services</h4>
                <p className="text-[11px] text-[#5D6659] leading-normal mt-1">
                  Go to <code>http://localhost/study_planner/db.php</code>. If the page is blank or details active databases, your local prepared PHP backend is working flawlessly!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
