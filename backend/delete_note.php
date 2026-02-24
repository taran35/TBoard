<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['username'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}
if (!isset($_POST['id'])) {
    echo json_encode(["status" => "error", "message" => "Missing id"]);
    exit;
}
$id = intval($_POST['id']);
require_once 'bdd.php';
$stmt = $mysqli->prepare("DELETE FROM notes WHERE id = ? AND user_id = ? LIMIT 1");
$stmt->bind_param("ii", $id, $_SESSION['user_id']);
if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
$stmt->close();
$mysqli->close();
