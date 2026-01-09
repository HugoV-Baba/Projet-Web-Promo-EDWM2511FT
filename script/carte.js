// MISE EN PLACE DE LA CARTE AVEC LES MARQUEURS EN FONCTION DES COORDONNEES DES APPRENANTS

const JSON_URL = "./data/promo.json";


delete L.Icon.Default.prototype._getIconUrl; 

L.Icon.Default.mergeOptions({
    iconRetinaUrl: './Ressources/marker-icon-2x.png', 
    iconUrl: './Ressources/marker-icon.png', 
    shadowUrl: './Ressources/marker-shadow.png' 
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Impossible de charger le fichier JSON");

        const data = await response.json();
        initMap(data.apprenants);

    } catch (error) {
        console.error("Erreur :", error);
        document.getElementById("map-container").innerHTML =
            "<p>Erreur lors du chargement de la carte.</p>";
    }
});


function initMap(apprenants) { 
    
    const map = L.map('map').setView([46.603354, 1.888334], 6); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); 


    const apprenantsAvecCoords = apprenants.filter(student => 
        student.coordonnees.latitude && 
        student.coordonnees.longitude
    );


    apprenantsAvecCoords.forEach(student => { 
        const lat = parseFloat(student.coordonnees.latitude); 
        const lng = parseFloat(student.coordonnees.longitude);
        
        const marker = L.marker([lat, lng]).addTo(map);
        
        
        marker.bindPopup(` 
            <div class="popup-content">
                <h3>${student.nom} ${student.prenom}</h3>
                <p><strong>Ville :</strong> ${student.ville}</p>
            </div>
        `);
    });

}