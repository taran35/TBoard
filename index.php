<?php 
session_start();
// COOKIE SETUP
if (!isset($_COOKIE['setup'])) {
    $configPath = "backend/config/status.json";
    $json = file_get_contents($configPath);
    $data = json_decode($json, true);
    $etat = $data['etat'];
    if ($etat == "true") {
        setcookie("setup", "true", time() + 604800, "/");
    } else {
        header('Location: frontend/config/init.php');
        exit;
    }
}

?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $_GET['page'] . " - TBoard" ?? 'TBoard'; ?></title>
    <link rel="icon" type="image/png" href="assets/img/favicon.png">

    <!-- import markdown css -->
    <link rel="stylesheet" href="assets/markdown-light.css" media="(prefers-color-scheme: light)">
    <link rel="stylesheet" href="assets/markdown-dark.css" media="(prefers-color-scheme: dark)">

    <!-- import css -->
    <link rel="stylesheet" href="assets/css/colors.css">
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/notes.css">

    <!-- import marked -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>


<body>

    <div id="header">
        <h1><button id="logoBtn" onClick="loadPage('home')">TBoard</button></h1>
        <input type="checkbox" id="nav-toggle" style="display:none;">
        <label for="nav-toggle" class="hamburger">☰</label>
        <nav>
            <ul id="nav-links">
                <li><button id="homeBtn" onClick="loadPage('home')">Accueil</button></li>
                <li><button id="markdownBtn" onClick="loadPage('markdown')">Markdown</button></li>
                <li><button id="LogoutBtn" onClick="logout()">Déconnexion</button></li>
            </ul>
        </nav>
    </div>
    
    <input type="checkbox" id="sidebar-toggle" style="display:none;">
    <label for="sidebar-toggle" class="sidebar-hamburger">☰</label>
    
    <div id="main-container">
        <div id="sidebar">
            <button id="taskListBtn" onClick="loadPage('taskList')">Liste de tâches</button>
            <div id="notesList">
            </div>
        </div>
        
        <div id="content"></div>
    </div>


<script src="backend/script.js"></script>
<script>
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    loadPage(page);
</script>


</body>

</html>