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
$email = trim($input['email'] ?? '');
$code = trim($input['code'] ?? '');
$role = strtolower(trim($input['role'] ?? 'student'));

if ($email === '' || $code === '') {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Email and code are required',
  ], 400);
}

$stmt = $conn->prepare('
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
    password,
    role,
    failed_attempts,
    is_locked,
    lockout_until,
    verification_code,
    created_at
  FROM users
  WHERE email = ?
  LIMIT 1
');

if (!$stmt) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Unable to prepare query',
  ], 500);
}

$stmt->bind_param('s', $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'User not found',
  ], 404);
}

if ($role !== '' && strtolower((string) ($user['role'] ?? 'student')) !== $role) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Selected role does not match this account.',
  ], 403);
}

if ((string) ($user['verification_code'] ?? '') !== $code) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Invalid verification code.',
  ], 401);
}

$clear = $conn->prepare('
  UPDATE users
  SET verification_code = NULL,
      failed_attempts = 0,
      is_locked = 0,
      lockout_until = NULL
  WHERE email = ?
');

if ($clear) {
  $clear->bind_param('s', $email);
  $clear->execute();
  $clear->close();
}

$stmt->close();
$conn->close();

campuswell_json([
  'status' => 'success',
  'message' => 'Verification successful',
  'user' => campuswell_map_user($user),
  'profile' => campuswell_map_user($user),
]);

