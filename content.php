<?php
session_start();
$page = $_GET['page'] ?? 'home';

$allowed_pages = ['home', 'markdown', 'taskList'];

if ($page === 'register') {
    if (isset($_SESSION['username'])) {
        echo json_encode(["redirect" => "home"]);
        exit;
    }
    include('frontend/account/register.php');
    exit;
}

if ($page === 'login') {
    if (isset($_SESSION['username'])) {
        echo json_encode(["redirect" => "home"]);
        exit;
    }
    include('frontend/account/login.php');
    exit;
}

if (!isset($_SESSION['username'])) {
    echo json_encode(["redirect" => "login"]);
    exit;
}

if (in_array($page, $allowed_pages)) {
    include("frontend/$page.php");
} else {
    include("frontend/404.php");
}