//SCRIPT PRINCIPAL POUR LA PAGE D'ACCUEIL


const JSON_URL = "./data/promo.json"; 
const DEFAULT_AVATAR = "./Ressources/default-avatar.png"; 
let cachedStudents = null; 

document.addEventListener("DOMContentLoaded", () => { 
    loadStudents();
    setupDisplaySwitch();
    setupModal(); 
});


async function loadStudents() { 
    try { 
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Impossible de charger le fichier JSON");

        const data = await response.json(); 
        cachedStudents = data.apprenants; 

        const prefs = JSON.parse(localStorage.getItem("preferences")) || {}; 
        const display = prefs.display || "list";

        displayStudents(display); 

    } catch (error) { 
        console.error(error);
        document.getElementById("students-list").innerHTML =
            "<p>Erreur lors du chargement des apprenants.</p>";
    }
}


function displayStudents(display) { 
    if (!cachedStudents) return;
    
    if (display === "grid") {
        createCards(cachedStudents);
        document.getElementById("rad-grid").checked = true;
    } else {
        createTable(cachedStudents);
        document.getElementById("rad-list").checked = true;
    }
}





//                                                                              == le Tableau ==


function createTable(apprenants) { //la fonction création du tableau

    const container = document.getElementById("students-list"); //on retrouve l'id de L'HTML
    container.innerHTML = ""; 

    //on s'occupe d'abord du tableau, du titre et de l'entête
    const title = document.createElement("h2");
    title.textContent = "Liste des apprenants";
    title.classList.add("students-title");
    container.appendChild(title);

    const table = document.createElement("table");
    table.classList.add("students-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Ville</th>
                <th></th>
            </tr>
        </thead>
    `;

    //ensuite le contenu du tableau avec la boucle forEach pour passer à l'apprenant suivant une fois la ligne complétée
    const tbody = document.createElement("tbody");

    apprenants.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student.nom}</td>
            <td>${student.prenom}</td>
            <td>${student.ville}</td>
            <td><a class="detail" href="#" data-id="${student.id}">Détail</a></td>
        `;
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    attachDetailEvents(); // on oublie pas de rattacher les évènements après la création dyna du tableau
}




//                                                                              == les Cartes ==


function createCards(apprenants) { //maintenant la fonction ccréation des cartes
    const container = document.getElementById("students-list");
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Liste des apprenants";
    title.classList.add("students-title");
    container.appendChild(title);

    const cardsWrapper = document.createElement("div"); //création de la constante cardsWrapper pour lui ajouter la classe CSS cards container
    cardsWrapper.classList.add("cards-container");

    apprenants.forEach(student => {
        const card = document.createElement("div");
        card.classList.add("student-card");

        card.innerHTML = `
            <h3>${student.nom}</h3>
            <p>${student.prenom}</p>
            <a class="detail-btn" href="#" data-id="${student.id}">Détail</a>
        `;

        cardsWrapper.appendChild(card);
    });

    container.appendChild(cardsWrapper);

    attachDetailEvents(); // comme pour le tableau car le DOM a changé
}





//                                                                          == le Switch Tableau/Cartes ==


function setupDisplaySwitch() { //la fonction du switch entre le tableau et les cartes
    const radios = document.querySelectorAll('input[name="display"]');

    radios.forEach(radio => { //on boucle sur chaque radio, l'un après l'autre on traite les boutons liste et cartes
        radio.addEventListener("change", () => { //l'évènement qui s'exécute dès qu'on clique sur l'un des deux boutons

            let display;
            if (radio.id === "rad-grid") {
                display = "grid";
            } else {
                display = "list";
            }

            displayStudents(display);
        });
    });
}




//                                                                              == la Modale ==


function setupModal() { //la fonction qui initialise la modale 
    const modal = document.getElementById("student-modal");
    const closeBtn = document.querySelector(".close-modal");

    closeBtn.addEventListener("click", closeModal); //pour fermer avec le bouton X
}



function attachDetailEvents() { //la fonction du bouton détail
    const detailLinks = document.querySelectorAll('.detail, .detail-btn'); 
    
    detailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const studentId = parseInt(link.getAttribute('data-id'));
            openModal(studentId);
        });
    });
}



function openModal(studentId) { //la fonction qui ouvre la modale
    const student = cachedStudents.find(s => s.id === studentId); //on recup l'apprenant concerné dans le tableau cachedStudents avec la fonction fléchée
    
    if (!student) { //si jamais on retrouve pas l'apprenant message d'erreur
        console.error("Apprenant introuvable");
        return;
    }

    // le remplissage des données qu'on retrouve dans la modale
    document.getElementById("modal-name").textContent = student.nom;
    document.getElementById("modal-prenom").textContent = student.prenom;
    document.getElementById("modal-ville").textContent = student.ville;
    document.getElementById("modal-anecdotes").textContent = student.anecdotes || "Aucune anecdote disponible.";

    // l'avatar de l'apprenant (yen a qu'un par défaut pour tt le monde)
    const avatarImg = document.getElementById("modal-avatar");

    avatarImg.src = "./Ressources/" + student.avatar;


    // et enfin on affiche la modale
    const modal = document.getElementById("student-modal");
    modal.classList.add("show");
}


function closeModal() { //la fonction qui ferme la modale
    const modal = document.getElementById("student-modal");
    modal.classList.remove("show");
}