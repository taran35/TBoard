// ----------------------------------
// gestion du chargement de page
// ----------------------------------

window.loadPage = function(page) {
    const content = document.getElementById('content');
    const cleanContent = removeAllEventListeners(content);

    fetch('content.php?page=' + page)
        .then(res => res.text())
        .then(data => {

            try {
                const json = JSON.parse(data);

                if (json.redirect) {
                    loadPage(json.redirect);
                    return;
                }
            } catch (e) {
            }

            cleanContent.innerHTML = data;
            history.pushState(null, "", "?page=" + page);

            if (page === 'login' || page === 'register') {
                document.getElementById('header').style.display = 'none';
                document.getElementById('sidebar').style.display = 'none';
                attachLoginListener();
                attachRegisterListener();
            } else {
                document.getElementById('header').style.display = 'flex';
                document.getElementById('sidebar').style.display = 'block';
                notesSidebar();
            }

            if (page === "home") {
                getMarkdown("home").then(md => {
                    renderMarkdown('md-container', md);
                });
            }
            else if (page === "markdown") {
                getMarkdown("markdown").then(md => {
                    renderMarkdown('md-container', md);
                });
            }
            else if (page === "editHome") {
                editHome();
            }
        });
}


window.addEventListener("popstate", function () {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page") || "home";
    loadPage(page);
});

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


function attachRegisterListener() {
    const form = document.getElementById("registerform");
    if (!form) return;



    form.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors();
        const pseudo = document.getElementById("pseudo").value.trim();
        const mail = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();
        const passConfirm = document.getElementById("passwordConfirm").value.trim();
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
        } else if (pass !== passConfirm) {
            showError("passwordConfirmError", "Les mots de passe ne correspondent pas");
            document.getElementById("passwordConfirm").classList.add("error");
            hasError = true;
        }

        if (!hasError) registerUser(pseudo, mail, pass);
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
// Enregistrement utilisateur
// ----------------------------------

function registerUser(pseudo, mail, pass) {
    fetch('backend/account/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'mail': mail,
            'pass': pass,
            'pseudo': pseudo
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
// Logout
// ----------------------------------

function logout() {
    fetch('backend/account/logout.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            loadPage('login'); 
        }
    })
    .catch(err => console.error(err));
}

// ----------------------------------
// Home ! 
// ----------------------------------

function editHome() {
    fetch('backend/home.php?action=get')
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                console.error(data.error);
                return;
            }

            const content = document.getElementById('content');

            content.innerHTML = `
                <div class="home-wrapper">
                    <input id="homeTitle" type="text" 
                           value="Editer le menu d'accueil" 
                           class="home-title"/>

                    <div class="editor-container">
                        <textarea id="homeTextarea" class="home-textarea">${data.content}</textarea>
                        <div class="resizer" id="dragbar"></div>
                        <div id="homePreview" class="markdown-body home-preview"></div>
                    </div>

                    <button id="saveHomeBtn" class="saved">💾 Sauvegarder</button>  <button id="hideHomeBtn">📃 Masquer</button>
                </div>
            `;

            const textarea = document.getElementById("homeTextarea");
            const preview = document.getElementById("homePreview");
            const resizer = document.getElementById("dragbar");
            const container = document.querySelector(".editor-container");
            let isResizing = false;
            let homeHide = true;
            const MIN = 15;
            const MAX = 85;



            document.querySelector(".home-textarea").style.display = "none";
            document.getElementById("saveHomeBtn").style.display = "none";
            document.getElementById("dragbar").style.display = "none";
            document.getElementById("hideHomeBtn").textContent = "📃 Afficher";
            document.getElementById("homePreview").style.width = "90%";


            attachEditorLiveUpdate("home");

            preview.innerHTML = marked.parse(textarea.value);

            textarea.addEventListener("input", () => {
                preview.innerHTML = marked.parse(textarea.value);
            });



            const savedWidth = localStorage.getItem("editorWidth");
            if (savedWidth) {
                textarea.style.width = savedWidth + "%";
                preview.style.width = (100 - savedWidth) + "%";
            }

            resizer.addEventListener("mousedown", () => {
                isResizing = true;
                document.body.classList.add("resizing");
            });

            document.addEventListener("mousemove", (e) => {
                if (!isResizing) return;

                const rect = container.getBoundingClientRect();
                let percent = ((e.clientX - rect.left) / rect.width) * 100;

                if (percent < MIN) percent = MIN;
                if (percent > MAX) percent = MAX;

                textarea.style.width = percent + "%";
                preview.style.width = (100 - percent) + "%";
            });

            document.addEventListener("mouseup", () => {
                if (!isResizing) return;

                isResizing = false;
                document.body.classList.remove("resizing");

                const finalWidth = parseFloat(textarea.style.width);
                localStorage.setItem("editorWidth", finalWidth);
            });

            resizer.addEventListener("dblclick", () => {
                textarea.style.width = "50%";
                preview.style.width = "50%";
                localStorage.setItem("editorWidth", 50);
            });




            document
                .getElementById("saveHomeBtn")
                .addEventListener("click", () => saveHome());
            document
                .getElementById("hideHomeBtn")
                .addEventListener("click", () => {
                    if (homeHide) {
                        document.querySelector(".home-textarea").style.display = "block";
                        document.getElementById("saveHomeBtn").style.display = "inline-block";
                        document.getElementById("dragbar").style.display = "block";
                        document.getElementById("hideHomeBtn").textContent = "📃 Masquer";
                        document.getElementById("homePreview").style.width = "50%";
                        homeHide = false;
                    } else {
                        document.querySelector(".home-textarea").style.display = "none";
                        document.getElementById("saveHomeBtn").style.display = "none";
                        document.getElementById("dragbar").style.display = "none";
                        document.getElementById("hideHomeBtn").textContent = "📃 Afficher";
                        document.getElementById("homePreview").style.width = "90%";
                        homeHide = true;
                    }
                });
        })
        .catch(err => console.error(err));
}


function saveHome() {

    const content = document.getElementById('homeTextarea').value.trim();

    fetch('backend/home.php?action=edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            content: content
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            isModified = false;
            document.getElementById("saveHomeBtn").textContent = "💾 Sauvegarder";
            document.getElementById("saveHomeBtn").disabled = true;
            document.getElementById("saveHomeBtn").classList.add("saved");
            document.getElementById("saveHomeBtn").classList.remove("to-save");
            loadPage("home");
        } else {
            alert("Erreur sauvegarde");
        }
    });
}
// ----------------------------------
// Rendu Markdown
// ----------------------------------

async function getMarkdown(page) {
    if (page === "home") {
        try {
            const response = await fetch('backend/home.php?action=get');
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                return "Une erreur est survenue !";
            }

            return data.content;

        } catch (error) {
            console.error(error);
            return "Une erreur est survenue !";
        }

    const tmp = `
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
- La page d'accueil est entièrement personnalisable en cliquant sur le bouton "Personnaliser" en haut à droite puis la modifier comme une feuille de notes et déplacer les widgets à votre convenance \n \n
`

    } else if (page === "markdown") {
        const response = await fetch("backend/markdown.md");
        return await response.text();
    }

} 
function renderMarkdown(containerId, markdown) {

    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof marked === 'undefined') {
        console.error('Marked library not loaded');
        container.innerHTML = '<p>Erreur: Bibliothèque Markdown non chargée.</p>';
        return;
    }

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

// ----------------------------------
// Notes
// ----------------------------------
let isModified = false;

function loadNote(id) {
    fetch('backend/get_note.php?id=' + id)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                console.error(data.error);
                return;
            }

            const content = document.getElementById('content');

            content.innerHTML = `
                <div class="note-wrapper">
                    <input id="noteTitle" type="text" 
                           value="${data.title}" 
                           class="note-title"/>

                    <div class="editor-container">
                        <textarea id="noteTextarea" class="note-textarea">${data.content}</textarea>
                        <div class="resizer" id="dragbar"></div>
                        <div id="notePreview" class="markdown-body note-preview"></div>
                    </div>

                    <button id="saveNoteBtn" class="saved">💾 Sauvegarder</button> <button id="deleteNoteBtn">🗑️ Supprimer</button> <button id="hideNoteBtn">📃 Masquer</button>
                </div>
            `;

            const textarea = document.getElementById("noteTextarea");
            const preview = document.getElementById("notePreview");
            const resizer = document.getElementById("dragbar");
            const container = document.querySelector(".editor-container");
            let isResizing = false;
            let noteHide = true;
            const MIN = 15;
            const MAX = 85;



            document.querySelector(".note-textarea").style.display = "none";
            document.getElementById("saveNoteBtn").style.display = "none";
            document.getElementById("deleteNoteBtn").style.display = "none";
            document.getElementById("dragbar").style.display = "none";
            document.getElementById("hideNoteBtn").textContent = "📃 Afficher";
            document.getElementById("notePreview").style.width = "90%";


            attachEditorLiveUpdate("note");

            preview.innerHTML = marked.parse(textarea.value);

            textarea.addEventListener("input", () => {
                preview.innerHTML = marked.parse(textarea.value);
            });



            const savedWidth = localStorage.getItem("editorWidth");
            if (savedWidth) {
                textarea.style.width = savedWidth + "%";
                preview.style.width = (100 - savedWidth) + "%";
            }

            resizer.addEventListener("mousedown", () => {
                isResizing = true;
                document.body.classList.add("resizing");
            });

            document.addEventListener("mousemove", (e) => {
                if (!isResizing) return;

                const rect = container.getBoundingClientRect();
                let percent = ((e.clientX - rect.left) / rect.width) * 100;

                if (percent < MIN) percent = MIN;
                if (percent > MAX) percent = MAX;

                textarea.style.width = percent + "%";
                preview.style.width = (100 - percent) + "%";
            });

            document.addEventListener("mouseup", () => {
                if (!isResizing) return;

                isResizing = false;
                document.body.classList.remove("resizing");

                const finalWidth = parseFloat(textarea.style.width);
                localStorage.setItem("editorWidth", finalWidth);
            });

            resizer.addEventListener("dblclick", () => {
                textarea.style.width = "50%";
                preview.style.width = "50%";
                localStorage.setItem("editorWidth", 50);
            });




            document
                .getElementById("saveNoteBtn")
                .addEventListener("click", () => saveNote(id));
            document
                .getElementById("deleteNoteBtn")
                .addEventListener("click", () => deleteNote(id));
            document
                .getElementById("hideNoteBtn")
                .addEventListener("click", () => {
                    if (noteHide) {
                        document.querySelector(".note-textarea").style.display = "block";
                        document.getElementById("saveNoteBtn").style.display = "inline-block";
                        document.getElementById("deleteNoteBtn").style.display = "inline-block";
                        document.getElementById("dragbar").style.display = "block";
                        document.getElementById("hideNoteBtn").textContent = "📃 Masquer";
                        document.getElementById("notePreview").style.width = "50%";
                        noteHide = false;
                    } else {
                        document.querySelector(".note-textarea").style.display = "none";
                        document.getElementById("saveNoteBtn").style.display = "none";
                        document.getElementById("deleteNoteBtn").style.display = "none";
                        document.getElementById("dragbar").style.display = "none";
                        document.getElementById("hideNoteBtn").textContent = "📃 Afficher";
                        document.getElementById("notePreview").style.width = "90%";
                        noteHide = true;
                    }
                });
        })
        .catch(err => console.error(err));
}




function attachEditorLiveUpdate(type) {
    let btn, textarea
    if (type === "note") {
    textarea = document.getElementById("noteTextarea");
    btn = document.getElementById("saveNoteBtn")
    } else if (type === "home") {
    textarea = document.getElementById("homeTextarea");
    btn = document.getElementById("saveHomeBtn")
    }
    textarea.addEventListener("input", () => {
        isModified = true;
        btn.textContent = "💾 Sauvegarder *";
        btn.disabled = false;
        btn.classList.remove("saved");
        btn.classList.add("to-save");

    });
}

function deleteNote(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;
    fetch('backend/delete_note.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            id: id
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            notesSidebar();
            loadPage('home');
        } else {
            alert("Erreur suppression");
        }
    });
}

function saveNote(id) {

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteTextarea').value.trim();

    fetch('backend/update_note.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            id: id,
            title: title,
            content: content
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            isModified = false;
            document.getElementById("saveNoteBtn").textContent = "💾 Sauvegarder";
            document.getElementById("saveNoteBtn").disabled = true;
            document.getElementById("saveNoteBtn").classList.add("saved");
            document.getElementById("saveNoteBtn").classList.remove("to-save");
            notesSidebar();
        } else {
            alert("Erreur sauvegarde");
        }
    });
}

function notesSidebar() {
    const sidebar = document.getElementById("notesList");
    if (!sidebar) {
        console.log('notesList not found');
        return;
    }

    fetch('backend/get_notes.php')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
            sidebar.innerHTML = "";
            data.forEach(note => {
                const item = document.createElement("div");
                item.classList.add("sidebar-item");
                item.textContent = note.title;
                item.addEventListener("click", function() {
                    loadNote(note.id);
                });
                sidebar.appendChild(item);
            });
        })
        .catch(err => console.error('Fetch error:', err));
}


// ----------------------------------
// NewButton Actions
// ----------------------------------

function createNote() {
    fetch('backend/create_note.php')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                notesSidebar();
                console.log(data);
                loadNote(data.note_id);
            })
            .catch(err => console.error('Fetch error:', err));
}
// ----------------------------------
// Init
// ----------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const taskBtn = document.getElementById('taskListBtn');
    if (taskBtn) {
        taskBtn.addEventListener('click', notesSidebar);
    }



    const headerHamburger = document.getElementById('headerHamburger');
    const headerNav = document.getElementById('headerNav');
    headerHamburger.addEventListener('click', () => {
        headerNav.classList.toggle('show');
    });

    const sidebarHamburger = document.getElementById('sidebarHamburger');
    const sidebar = document.getElementById('sidebar');
    sidebarHamburger.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    const newButton = document.getElementById('newButton');
    const newMenu = document.getElementById('newMenu');
    newButton.addEventListener('click', () => {
        newMenu.classList.toggle('show');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            headerNav.classList.remove('show');
            sidebar.classList.remove('show');
        }
    });



    marked.setOptions({
        breaks: true,
        gfm: true
    });

});