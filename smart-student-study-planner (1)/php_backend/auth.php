<?php
/**
 * Authentication and Session Management Backend
 * Handles password hashing (bcrypt), registration, login, and verification endpoints safely.
 */

require_once 'db.php';

// Secure Session Initialization
if (session_status() == PHP_SESSION_NONE) {
    // Set secure cookie flags
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    // Overwrite session-related settings
    session_start();
}

/**
 * Register a new student
 */
function registerUser($name, $email, $password) {
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
        return ['status' => 'error', 'message' => 'Please provide valid input parameters.'];
    }

    if (strlen($password) < 6) {
        return ['status' => 'error', 'message' => 'Password must be at least 6 characters long.'];
    }

    $pdo = getDBConnection();

    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            return ['status' => 'error', 'message' => 'This email address is already registered.'];
        }

        // Hash password securely using BCrypt algorithm
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insert new user record
        $insertStmt = $pdo->prepare("
            INSERT INTO users (name, email, password, academic_level, academic_major, gpa_target) 
            VALUES (:name, :email, :password, 'Undergraduate', 'Computer Science', 4.00)
        ");
        $insertStmt->execute([
            'name' => htmlspecialchars(strip_tags($name)),
            'email' => $email,
            'password' => $hashedPassword
        ]);

        $newUserId = $pdo->lastInsertId();

        // Automatically log in the user upon registration
        $_SESSION['user_id'] = $newUserId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;

        return ['status' => 'success', 'message' => 'Registration successful!', 'user' => [
            'id' => $newUserId,
            'name' => $name,
            'email' => $email
        ]];

    } catch (PDOException $e) {
        error_log("Registration SQL Error: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'An internal server error occurred. Please try again.'];
    }
}

/**
 * Log in an existing student
 */
function loginUser($email, $password) {
    if (empty($email) || empty($password)) {
        return ['status' => 'error', 'message' => 'Please enter both email and password.'];
    }

    $pdo = getDBConnection();

    try {
        // Fetch user from database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Regeneration of session ID protects against Session Fixation
            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];

            return ['status' => 'success', 'message' => 'Login successful!', 'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'academic_level' => $user['academic_level'],
                'academic_major' => $user['academic_major'],
                'gpa_target' => $user['gpa_target']
            ]];
        } else {
            return ['status' => 'error', 'message' => 'Invalid email address or password.'];
        }

    } catch (PDOException $e) {
        error_log("Login SQL Error: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'An error occurred during verification.'];
    }
}

/**
 * Log out student and destroy session
 */
function logoutUser() {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    return ['status' => 'success', 'message' => 'Logged out successfully!'];
}
