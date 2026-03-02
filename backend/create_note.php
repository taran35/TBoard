<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

require_once 'bdd.php'; 

$stmt = $mysqli->prepare("INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)");
$title = "Nouvelle Note";
$content = "> Bienvenue dans votre nouvelle note !";
$user_id = $_SESSION["user_id"];

$stmt->bind_param("ssi", $title, $content, $user_id);

if ($stmt->execute()) {

    $id = $mysqli->insert_id;

    echo json_encode([
        "status" => "success",
        "note_id" => $id
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Database error"
    ]);
}

$stmt->close();
$mysqli->close();