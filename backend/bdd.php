<?php

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$host = $_ENV['DB_HOST'];
$db = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];




$mysqli = new mysqli($host, $user, $pass, $db);
$mysqli->set_charset("utf8");
$offset = date('I') ? '+02:00' : '+01:00';
$mysqli->query("SET time_zone = '$offset'");

if ($mysqli->connect_error) {
    die("Erreur de connexion:" . $mysqli->connect_error);
    echo 'erreur_mysql';
}