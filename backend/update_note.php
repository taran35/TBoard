<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

if (!isset($_POST['id'], $_POST['title'], $_POST['content'])) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$id = intval($_POST['id']);
$title = $_POST['title'];
$content = $_POST['content'];

require_once 'bdd.php'; 


$stmt = $mysqli->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ?");
$stmt->bind_param("ssi", $title, $content, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}

$stmt->close();
$mysqli->close();