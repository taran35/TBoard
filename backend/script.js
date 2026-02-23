// ----------------------------------
// gestion du chargement de page
// ----------------------------------

window.loadPage = function(page) {
    const content = document.getElementById('content');
    const cleanContent = removeAllEventListeners(content);
    fetch('content.php?page=' + page)
        .then(res => res.text())
        .then(data => {
            cleanContent.innerHTML = data;
            history.pushState(null, "", "?page=" + page);



            attachLoginListener();
            if (page === "home") {

                renderMarkdown('md-container', getMarkdown("home"));
            }
        });
}

// ----------------------------------
// gestion event listeners
// ----------------------------------

function removeAllEventListeners(container) {
    if (!container) return;
    const clone = container.cloneNode(true);
    container.parentNode.replaceChild(clone, container);

    return clone; 
}
function attachLoginListener() {
    const form = document.getElementById("loginform");
    if (!form) return;



    form.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors();

        const mail = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();
        let hasError = false;

        if (!mail) {
            showError("emailError", "L'adresse email est requise");
            document.getElementById("email").classList.add("error");
            hasError = true;
        } else if (!validateEmail(mail)) {
            showError("emailError", "L'adresse email est incorrecte");
            document.getElementById("email").classList.add("error");
            hasError = true;
        }

        if (!pass) {
            showError("passwordError", "Le mot de passe est requis");
            document.getElementById("password").classList.add("error");
            hasError = true;
        } else if (pass.length < 8) {
            showError("passwordError", "Le mot de passe doit faire au minimum 8 caractères");
            document.getElementById("password").classList.add("error");
            hasError = true;
        }

        if (!hasError) loginVerif(mail, pass);
    });
}

// ----------------------------------
// Erreurs login
// ----------------------------------

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error"));
}

// ----------------------------------
// Validation email et login
// ----------------------------------

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function loginVerif(mail, pass) {
    fetch('backend/account/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'mail': mail,
            'pass': pass
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.loadPage('home');
        } else {
            showError("globalError", data.message);
        }
    })
    .catch(error => {
        showError("globalError", "Erreur de connexion au serveur.");
        console.error(error);
    });
}


// ----------------------------------
// Rendu Markdown
// ----------------------------------

function getMarkdown(page) {
    const markdown = `
> ## Bienvenue sur TBoard ! 
> TBoard est un tableau de bord personnalisable qui vous permet de suivre vos tâches, vos projets et vos objectifs en un seul endroit.\n \n 
## Création de feuilles de notes: \n - Cliquez sur **+** et choisissez "Nouvelle feuille de notes" 
- Elles peuvent être retrouvés dans l'onglet "Feuilles de notes" 
- Vous pouvez utiliser du markdown pour donner un style à vos notes, voir les différentes syntaxes [ici](index.php?page=markdown) \n \n
## Utilisation de la liste de tâches: 
- Cliquez sur **+** et choisissez "Nouvelle tâche" 
- Elles peuvent être retrouvés dans la page "Tâches" 
- Cliquez sur une tâche pour la marquer comme terminée, ou cliquez sur le bouton de suppression pour la supprimer \n \n
## Personnalisation du tableau de bord: 
- Cliquez sur **+** et choisissez "Ajouter un widget" \n
- Vous pouvez choisir d'importer une feuille de notes ou une liste de tâches, ou créer un widget personnalisé 
- La page d'accueil est entièrement personnalisable en cliquant sur le bouton "Personnaliser" en haut à droite puis la modifier comme une feuille de notes et déplacer les widgets à votre convenance \n \n`

;
    return markdown
} 
function renderMarkdown(containerId, markdown) {

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = marked.parse(markdown);
    container.classList.add("markdown-body");

    container.querySelectorAll('a[href^="index.php?page="]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const url = new URL(link.href, window.location.origin);
            const page = url.searchParams.get('page');

            if (page) loadPage(page);
        });
    });
}