<?php
session_start();
require 'bdd.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(['error' => 'No id']);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "SELECT id, title, content FROM notes WHERE id = ? AND user_id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param('ii', $id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['error' => 'Note not found']);
    exit;
}

$note = $result->fetch_assoc();
echo json_encode($note);
?>