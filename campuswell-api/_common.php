<?php

function campuswell_db() {
  $conn = new mysqli('localhost', 'root', '', 'campuswell_db');
  if ($conn->connect_error) {
    return null;
  }

  $conn->set_charset('utf8mb4');
  return $conn;
}

function campuswell_json($payload, $statusCode = 200) {
  http_response_code($statusCode);
  echo json_encode($payload);
  exit;
}

function campuswell_read_input() {
  $input = json_decode(file_get_contents('php://input'), true);
  return is_array($input) ? $input : [];
}

function campuswell_map_user($row) {
  if (!$row) return null;

  $firstName = $row['first_name'] ?? '';
  $middleName = $row['middle_name'] ?? '';
  $lastName = $row['last_name'] ?? '';
  $name = trim(implode(' ', array_filter([$firstName, $middleName !== 'N/A' ? $middleName : '', $lastName])));

  return [
    'id' => $row['id'] ?? null,
    'student_id' => $row['student_id'] ?? '',
    'studentId' => $row['student_id'] ?? '',
    'first_name' => $firstName,
    'firstName' => $firstName,
    'middle_name' => $middleName,
    'middleName' => $middleName,
    'last_name' => $lastName,
    'lastName' => $lastName,
    'name' => $name,
    'fullName' => $name,
    'year_level' => $row['year_level'] ?? '',
    'yearLevel' => $row['year_level'] ?? '',
    'contact_number' => $row['contact_number'] ?? '',
    'contactNumber' => $row['contact_number'] ?? '',
    'email' => $row['email'] ?? '',
    'address' => $row['address'] ?? '',
    'role' => $row['role'] ?? 'student',
    'failed_attempts' => isset($row['failed_attempts']) ? (int) $row['failed_attempts'] : 0,
    'failedAttempts' => isset($row['failed_attempts']) ? (int) $row['failed_attempts'] : 0,
    'is_locked' => isset($row['is_locked']) ? (int) $row['is_locked'] : 0,
    'isLocked' => isset($row['is_locked']) ? (int) $row['is_locked'] : 0,
    'lockout_until' => $row['lockout_until'] ?? null,
    'lockoutUntil' => $row['lockout_until'] ?? null,
    'verification_code' => $row['verification_code'] ?? null,
    'verificationCode' => $row['verification_code'] ?? null,
    'created_at' => $row['created_at'] ?? null,
    'createdAt' => $row['created_at'] ?? null,
  ];
}

function campuswell_password_matches($inputPassword, $storedPassword) {
  if ($storedPassword === null) return false;

  $storedPassword = (string) $storedPassword;
  if (password_verify($inputPassword, $storedPassword)) return true;

  return hash_equals($storedPassword, (string) $inputPassword);
}

function campuswell_now_mysql() {
  return date('Y-m-d H:i:s');
}

