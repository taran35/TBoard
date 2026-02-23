<?php
session_start();
require_once '../bdd.php';

header('Content-Type: application/json');

$mail = trim($_POST['mail'] ?? '');
$pass = $_POST['pass'] ?? '';
$pseudo = htmlspecialchars(trim($_POST['pseudo'] ?? ''));

if ($mail === '' || $pass === '' || $pseudo === '') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email, mot de passe et pseudo sont requis.'
    ]);
    exit();
}

if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => "L'adresse email est incorrecte."
    ]);
    exit();
}

$sql = "SELECT id FROM users WHERE mail = ? LIMIT 1";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $mail);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        'status' => 'error',
        'message' => 'Un compte avec cet email existe déjà.'
    ]);
    exit();
}
$stmt->close();

$token = bin2hex(random_bytes(16));
$pass_hash = password_hash($pass . $token, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (pseudo, mail, password) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sss", $pseudo, $mail, $pass_hash);
if ($stmt->execute()) {
    $user_id = $stmt->insert_id;
    $stmt->close();

    $sql = "INSERT INTO mdp_tokens (id, token) VALUES (?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("is", $user_id, $token);
    $stmt->execute();
    $stmt->close();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Compte créé avec succès.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => "Erreur lors de la création du compte."
    ]);
}

