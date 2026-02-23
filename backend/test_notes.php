<?php
require 'bdd.php';

$query = "SELECT * FROM notes";
$result = $mysqli->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . " - Title: " . $row['title'] . " - User: " . $row['user_id'] . "<br>";
    }
} else {
    echo "Erreur: " . $mysqli->error;
}

$mysqli->close();
?>