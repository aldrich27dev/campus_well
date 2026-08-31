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
$password = (string) ($input['password'] ?? '');
$role = strtolower(trim($input['role'] ?? 'student'));

if ($email === '' || $password === '') {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Email and password are required',
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
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Invalid username or password.',
  ], 401);
}

if ((int) ($user['is_locked'] ?? 0) === 1) {
  $lockoutUntil = $user['lockout_until'] ?? null;
  if ($lockoutUntil && strtotime($lockoutUntil) > time()) {
    $stmt->close();
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Account is temporarily locked. Please try again later.',
    ], 423);
  }
}

if ($role !== '' && strtolower((string) ($user['role'] ?? 'student')) !== $role) {
  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Selected role does not match this account.',
  ], 403);
}

$matches = campuswell_password_matches($password, $user['password'] ?? '');

if (!$matches) {
  $failedAttempts = ((int) ($user['failed_attempts'] ?? 0)) + 1;
  $isLocked = $failedAttempts >= 5 ? 1 : 0;
  $lockoutUntil = $isLocked ? date('Y-m-d H:i:s', strtotime('+15 minutes')) : null;

  $update = $conn->prepare('
    UPDATE users
    SET failed_attempts = ?, is_locked = ?, lockout_until = ?
    WHERE email = ?
  ');
  if ($update) {
    $update->bind_param('iiss', $failedAttempts, $isLocked, $lockoutUntil, $email);
    $update->execute();
    $update->close();
  }

  $stmt->close();
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Invalid username or password.',
  ], 401);
}

$requiresMfa = !empty($user['verification_code']);

$reset = $conn->prepare('
  UPDATE users
  SET failed_attempts = 0,
      is_locked = 0,
      lockout_until = NULL
  WHERE email = ?
');
if ($reset) {
  $reset->bind_param('s', $email);
  $reset->execute();
  $reset->close();
}

$stmt->close();
$conn->close();

campuswell_json([
  'status' => 'success',
  'requires_mfa' => $requiresMfa,
  'user' => campuswell_map_user($user),
  'profile' => campuswell_map_user($user),
]);

