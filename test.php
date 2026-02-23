<?php

$mdp = "test1234";
$token = bin2hex(random_bytes(16));
$pass_hash = password_hash($mdp . $token, PASSWORD_DEFAULT);
echo "Mot de passe : $mdp\n";
echo "Token : $token\n";
echo "Hash : $pass_hash\n";
