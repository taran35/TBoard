<?php
session_start();
require_once '../bdd.php';

header('Content-Type: application/json');

$mail = trim($_POST['mail'] ?? '');
$pass = $_POST['pass'] ?? '';

if ($mail === '' || $pass === '') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email et mot de passe sont requis.'
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

$sql = "SELECT id, pseudo, password FROM users WHERE mail = ? LIMIT 1";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $mail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email ou mot de passe incorrect.'
    ]);
    exit();
}

$user = $result->fetch_assoc();
$stmt->close();

/*
|--------------------------------------------------------------------------
| Token de salage pour mot de passe
|--------------------------------------------------------------------------
*/

$sql = "SELECT token FROM mdp_tokens WHERE id = ? LIMIT 1";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $user['id']);
$stmt->execute();
$result = $stmt->get_result();
$token_row = $result->fetch_assoc();
$pass_hash = $token_row['token'] ?? '';
$stmt->close();

/*
|--------------------------------------------------------------------------
| Vérification mot de passe
|--------------------------------------------------------------------------
*/

if (!password_verify($pass . $pass_hash, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email ou mot de passe incorrect.'
    ]);
    exit();
}

/*
|--------------------------------------------------------------------------
| Sécurité session
|--------------------------------------------------------------------------
*/

session_regenerate_id(true);

$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['pseudo'];

echo json_encode([
    'status' => 'success'
]);

$mysqli->close();