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
    <link rel="icon" type="image/png" href="./assets/img/favicon.png">
    <link rel="stylesheet" href="assets/markdown.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}

	/* Navbar Styles */
	#header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #333;
		color: white;
		padding: 10px 20px;
		position: relative;
	}

	#header h1 {
		margin: 0;
	}

	#header h1 button {
		background: none;
		border: none;
		color: white;
		font-size: 1.5em;
		cursor: pointer;
	}

	.hamburger {
		display: none;
		font-size: 1.5em;
		cursor: pointer;
		color: white;
	}

	.sidebar-hamburger {
		display: none;
		font-size: 1.2em;
		cursor: pointer;
		color: white;
		margin-left: 10px;
	}

	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
	}

	nav ul li {
		margin: 0 10px;
	}

	nav ul li button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 10px;
		transition: background-color 0.3s;
	}

	nav ul li button:hover {
		background-color: #555;
	}

	/* Responsive Styles */
	@media (max-width: 768px) {
		.hamburger {
			display: block;
		}

		.sidebar-hamburger {
			display: block;
			position: fixed;
			bottom: 20px;
			left: 20px;
			background: #333;
			color: white;
			border-radius: 50%;
			width: 50px;
			height: 50px;
			font-size: 1.5em;
			text-align: center;
			line-height: 50px;
			cursor: pointer;
			z-index: 1000;
			border: none;
		}

		nav ul {
			display: none;
			flex-direction: column;
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			background-color: #333;
			z-index: 1;
		}

		#nav-toggle:checked ~ nav ul {
			display: flex;
		}

		nav ul li {
			margin: 0;
			width: 100%;
		}

		nav ul li button {
			width: 100%;
			text-align: left;
		}

		#sidebar {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			z-index: 10;
		}

		#sidebar-toggle:checked ~ #main-container #sidebar {
			display: block;
		}
	}

	/* Sidebar Styles */
	#main-container {
		display: flex;
		min-height: calc(100vh - 60px);
	}

	#sidebar {
		width: 250px;
		background-color: #f4f4f4;
		padding: 20px;
		border-right: 1px solid #ddd;
	}

	#sidebar button {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		background-color: #007bff;
		color: white;
		border: none;
		cursor: pointer;
	}

	#sidebar button:hover {
		background-color: #0056b3;
	}

	#sidebar select {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
	}

	#notesList {
		margin-top: 10px;
	}

	.sidebar-item {
		padding: 5px;
		cursor: pointer;
		border-bottom: 1px solid #ddd;
	}

	.sidebar-item:hover {
		background-color: #f0f0f0;
	}

	.hidden {
		display: none;
	}

	#content {
		flex: 1;
		padding: 20px;
	}


</style>


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