<?php
require_once __DIR__ . '/_common.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  campuswell_json(['status' => 'success']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  campuswell_json([
    'status' => 'error',
    'message' => 'Method not allowed',
  ], 405);
}

$conn = campuswell_db();
if (!$conn) {
  campuswell_json([
    'status' => 'error',
    'message' => 'Database connection failed',
  ], 500);
}

$input = campuswell_read_input();

$studentId = trim($input['studentId'] ?? '');
$lastName = trim($input['lastName'] ?? '');
$middleName = trim($input['middleName'] ?? '');
$firstName = trim($input['firstName'] ?? '');
$yearLevel = trim($input['yearLevel'] ?? '');
$contactNumber = trim($input['contactNumber'] ?? '');
$email = trim($input['email'] ?? '');
$address = trim($input['address'] ?? '');
$password = (string) ($input['password'] ?? '');
$role = 'student';

if ($middleName === '' || strtoupper($middleName) === 'N/A') {
  $middleName = 'N/A';
}

if ($studentId === '' || $lastName === '' || $firstName === '' || $yearLevel === '' || $contactNumber === '' || $email === '' || $address === '' || $password === '') {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'All registration fields are required',
  ], 400);
}

$check = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
if (!$check) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Unable to prepare duplicate check',
  ], 500);
}

$check->bind_param('s', $email);
$check->execute();
$existing = $check->get_result()->fetch_assoc();
$check->close();

if ($existing) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Email already exists',
  ], 409);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare('
  INSERT INTO users (
    student_id,
    first_name,
    middle_name,
    last_name,
    year_level,
    contact_number,
    email,
    address,
    password,
    role,
    failed_attempts,
    is_locked,
    lockout_until,
    verification_code
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NULL, NULL)
');

if (!$stmt) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Unable to prepare insert query',
  ], 500);
}

$stmt->bind_param(
  'sssssssss',
  $studentId,
  $firstName,
  $middleName,
  $lastName,
  $yearLevel,
  $contactNumber,
  $email,
  $address,
  $hashedPassword
);

$stmt->execute();

if ($stmt->affected_rows <= 0) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Registration failed',
  ], 500);
}

$newId = $stmt->insert_id;
$stmt->close();

$fetch = $conn->prepare('
  SELECT
    id,
    student_id,
    first_name,
    middle_name,
    last_name,
    year_level,
    contact_number,
    email,
    address,
    role,
    failed_attempts,
    is_locked,
    lockout_until,
    verification_code,
    created_at
  FROM users
  WHERE id = ?
  LIMIT 1
');

if (!$fetch) {
  $conn->close();
  campuswell_json([
    'status' => 'success',
    'message' => 'Account created',
  ]);
}

$fetch->bind_param('i', $newId);
$fetch->execute();
$created = $fetch->get_result()->fetch_assoc();
$fetch->close();
$conn->close();

campuswell_json([
  'status' => 'success',
  'message' => 'Account created',
  'user' => campuswell_map_user($created),
  'profile' => campuswell_map_user($created),
]);

