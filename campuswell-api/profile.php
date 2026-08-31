<?php
require_once __DIR__ . '/_common.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  campuswell_json(['status' => 'success']);
}

$conn = campuswell_db();
if (!$conn) {
  campuswell_json([
    'status' => 'error',
    'message' => 'Database connection failed',
  ], 500);
}

$email = $_SERVER['REQUEST_METHOD'] === 'GET'
  ? ($_GET['email'] ?? '')
  : (campuswell_read_input()['email'] ?? '');

$email = trim($email);
if ($email === '') {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Email is required',
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

$stmt->close();
$conn->close();

if ($user) {
  campuswell_json([
    'status' => 'success',
    'profile' => campuswell_map_user($user),
  ]);
}

campuswell_json([
  'status' => 'error',
  'message' => 'User not found',
], 404);
