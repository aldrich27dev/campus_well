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
$action = trim($input['action'] ?? '');
$email = trim($input['email'] ?? '');

if ($action === '' || $email === '') {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Action and email are required',
  ], 400);
}

$lookup = $conn->prepare('SELECT id, verification_code FROM users WHERE email = ? LIMIT 1');
if (!$lookup) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Unable to prepare account lookup',
  ], 500);
}

$lookup->bind_param('s', $email);
$lookup->execute();
$user = $lookup->get_result()->fetch_assoc();
$lookup->close();

if (!$user) {
  $conn->close();
  campuswell_json([
    'status' => 'error',
    'message' => 'Email not found.',
  ], 404);
}

if ($action === 'request_otp') {
  $code = (string) random_int(100000, 999999);
  $update = $conn->prepare('UPDATE users SET verification_code = ? WHERE email = ?');
  if (!$update) {
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Unable to generate verification code',
    ], 500);
  }

  $update->bind_param('ss', $code, $email);
  $update->execute();
  $update->close();
  $conn->close();

  campuswell_json([
    'status' => 'success',
    'message' => 'Verification code generated',
    'code' => $code,
  ]);
}

if ($action === 'verify_otp') {
  $code = trim($input['code'] ?? '');
  if ($code === '') {
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Verification code is required',
    ], 400);
  }

  if ((string) ($user['verification_code'] ?? '') !== $code) {
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Invalid verification code.',
    ], 401);
  }

  $conn->close();
  campuswell_json([
    'status' => 'success',
    'message' => 'Verification successful',
  ]);
}

if ($action === 'reset_password') {
  $password = (string) ($input['password'] ?? '');
  if ($password === '') {
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Password is required',
    ], 400);
  }

  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
  $update = $conn->prepare('
    UPDATE users
    SET password = ?,
        verification_code = NULL
    WHERE email = ?
  ');
  if (!$update) {
    $conn->close();
    campuswell_json([
      'status' => 'error',
      'message' => 'Unable to update password',
    ], 500);
  }

  $update->bind_param('ss', $hashedPassword, $email);
  $update->execute();
  $update->close();
  $conn->close();

  campuswell_json([
    'status' => 'success',
    'message' => 'Password updated',
  ]);
}

$conn->close();
campuswell_json([
  'status' => 'error',
  'message' => 'Unknown action',
], 400);

