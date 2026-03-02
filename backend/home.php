<?php
session_start();
require 'bdd.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$action = $_GET['action'] ?? null;
if (!$action) {
    echo json_encode(['error' => 'No action']);
    exit;
}

$user_id = $_SESSION['user_id'];
if ($action === "get") {
    $query = "SELECT content FROM homes WHERE user_id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        echo json_encode(['error' => 'Home not found !']);
        exit;
    }

    $home = $result->fetch_assoc();
    echo json_encode($home);
    $stmt->close();

} else if ($action === "edit") {
    if (!isset($_POST['content'])) {
        echo json_encode(["status" => "error", "message" => "Missing data"]);
        exit;
    }
    $content = $_POST['content'];
    $stmt = $mysqli->prepare("UPDATE homes SET content = ? WHERE user_id = ?");
    $stmt->bind_param("si", $content, $_SESSION["user_id"]);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error"]);
    }
    $stmt->close();
}

$mysqli->close();
?>