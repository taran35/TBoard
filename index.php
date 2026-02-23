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
</style>


</head>


<body>
    
    <div id="content"></div>


<script src="backend/script.js"></script>
<script>
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    loadPage(page);
</script>


</body>

</html>