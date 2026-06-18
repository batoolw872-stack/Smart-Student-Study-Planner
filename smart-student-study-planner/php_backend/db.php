<?php
/**
 * Database Connection Configuration
 * Uses secure PHP Data Objects (PDO) for robust error management and prepared statements.
 */

// Define database parameters
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Typically empty by default on local installations like XAMPP
define('DB_NAME', 'study_planner');
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    // Set PDO options for high security and performance
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays by default
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Disable emulation of prepared statements to prevent injection
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (\PDOException $e) {
        // Log the actual error securely for developers, but output a clean message to the user
        error_log("Database Connection Failure: " . $e->getMessage());
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            'error' => 'Database connection failed. Please ensure MySQL is running and database configuration is correct.'
        ]);
        exit;
    }
}
