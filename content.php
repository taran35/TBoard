<?php
session_start();
$page = $_GET['page'] ?? 'home';

$allowed_pages = ['home', 'markdown'];

if (!isset($_SESSION['username'])) {
    include('frontend/account/login.php');
} else {
    $username = $_SESSION['username'];
    if (in_array($page, $allowed_pages)) {
        include("frontend/$page.php");

    } else {
        include("frontend/404.php");
    }
}