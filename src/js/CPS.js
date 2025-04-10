// CPS.js
document.addEventListener('DOMContentLoaded', function () {
    const jett = document.querySelector('.agent.jett');
    const scoreDisplay = document.getElementById('currencyDisplay');

    if (!jett) {
        console.error("L'image Jett n'a pas été trouvée !");
        return;
    }

    // Récupérer les crédits depuis le localStorage ou initialiser à 1000 (comme dans ameliorations.js)
    let credits = parseInt(localStorage.getItem('credits')) || 1000;

    let clickMultiplier = 1; // Multiplicateur par défaut

    // Afficher les crédits au chargement de la page
    updateCreditsDisplay();

    // Fonction pour mettre à jour l'affichage des crédits (identique à celle dans ameliorations.js)
    function updateCreditsDisplay() {
        scoreDisplay.innerHTML = `
            <div class="score-container d-flex align-items-center text-light">
                <img src="assets/money.webp" alt="money" class="money-icon me-2" />
                <span id="score">${Math.floor(credits)}</span> <!-- Arrondir les crédits -->
            </div>
        `;
    }

    // Fonction pour sauvegarder les crédits (identique à celle dans ameliorations.js)
    function saveCreditsToLocalStorage() {
        localStorage.setItem('credits', Math.floor(credits)); // Sauvegarder les crédits arrondis
    }

    // Fonction de clic sur Jett
    jett.addEventListener('click', () => {
        console.log('Jett a été cliqué');
        console.log(`Multiplicateur actuel : ${clickMultiplier}`); // Vérifiez la valeur
        credits += clickMultiplier;  // Applique le multiplicateur
        credits = Math.floor(credits); // Arrondir les crédits à l'entier inférieur
        saveCreditsToLocalStorage();
        updateCreditsDisplay();
    });

    // Fonction pour mettre à jour le multiplicateur
    function updateClickMultiplier() {
        const ameliorations = JSON.parse(localStorage.getItem('ameliorations')) || {};
        let totalMultiplier = 1; // Multiplicateur de base

        // Parcourir les catégories d'améliorations
        ['agents', 'armes', 'competences'].forEach(category => {
            if (ameliorations[category]) {
                ameliorations[category].forEach(item => {
                    totalMultiplier += (item.nombre_achat || 0) * (item.multiplicateur || 1);
                });
            }
        });

        clickMultiplier = Math.floor(totalMultiplier); // Arrondir le multiplicateur total
        console.log(`Nouveau multiplicateur de clic : ${clickMultiplier}`);
    }

    // Mettre à jour le multiplicateur au chargement
    updateClickMultiplier();

    let health = 100;
    const pixelHealthFill = document.getElementById("pixel-health-fill");
    const agentImage = document.querySelector(".agent");

    // ... (le reste du code existant reste inchangé)
    const jettImage = 'assets/Jett.gif';
    const neonImage = 'assets/Neon.gif';
    const chamberImage = 'assets/Chamber.gif';
    const omenImage = 'assets/Omen.gif';
    const skyeImage = 'assets/Skye.gif';

    const characters = [jettImage, chamberImage, neonImage, omenImage, skyeImage];
    let currentCharacterIndex = 0;
    let chamberOffsetX = 7;

    agentImage.src = jettImage;
    agentImage.style.transform = "scale(1)";

    function changeCharacter() {
        currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
        const currentCharacter = characters[currentCharacterIndex];
        agentImage.src = currentCharacter;

        if (currentCharacter === chamberImage) {
            agentImage.style.transform = `scale(1) translateX(${chamberOffsetX}px)`;
        } else if (currentCharacter === omenImage || currentCharacter === skyeImage) {
            agentImage.style.transform = "scale(1)";
        } else if (currentCharacter === neonImage) {
            agentImage.style.transform = "scale(1.1)";
        } else {
            agentImage.style.transform = "scale(1)";
        }

        health = 100;
        pixelHealthFill.style.width = health + "%";
    }

    agentImage.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (health > 0) {
            health -= 5;
            pixelHealthFill.style.width = health + "%";
        }

        if (health <= 0) {
            changeCharacter();
        }
        
    });

    if (item.category === 'agents') {
        updateClickMultiplier(item.multiplicateur); // Met à jour le multiplicateur
    }
});