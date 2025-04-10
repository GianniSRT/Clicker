document.addEventListener('DOMContentLoaded', function () {
    const jett = document.querySelector('.agent.jett');  // Sélection de l'image Jett
    const scoreDisplay = document.getElementById('currencyDisplay');  // Sélection de l'élément pour afficher le score (anciennement le span)

    // Vérification de la sélection de l'image jett
    if (!jett) {
        console.error("L'image Jett n'a pas été trouvée !");
        return;
    }

    // Récupérer le score depuis le localStorage ou initialiser à 0
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

    // Afficher le score au chargement de la page
    const moneyIcon = document.createElement("img");
    moneyIcon.src = "assets/money.webp";
    moneyIcon.alt = "money";
    moneyIcon.classList.add("money-icon");

    const scoreText = document.createElement("span");
    scoreText.textContent = score;

    scoreDisplay.appendChild(moneyIcon);
    scoreDisplay.appendChild(scoreText);

    // Fonction de clic sur Jett
    jett.addEventListener('click', () => {
        console.log('Jett a été cliqué');  // Débogage pour voir si le clic est détecté
        score++;  // Incrémente le score de 1
        scoreText.textContent = score;  // Met à jour l'affichage du score
        localStorage.setItem('score', score);  // Sauvegarde le score dans le localStorage
    });
});

let health = 100;
const pixelHealthFill = document.getElementById("pixel-health-fill");
const agentImage = document.querySelector(".agent");

// Déclaration des images des personnages
const jettImage = 'assets/Jett.gif';
const neonImage = 'assets/Neon.gif';
const chamberImage = 'assets/Chamber.gif';
const omenImage = 'assets/Omen.gif';
const skyeImage = 'assets/Skye.gif';

// Liste des personnages dans l'ordre
const characters = [jettImage, chamberImage, neonImage, omenImage, skyeImage];

// Variable pour savoir quel personnage est actuellement affiché
let currentCharacterIndex = 0;  // On commence avec Jett
let chamberOffsetX = 7;  // Décalage de Chamber à droite

// Initialiser Jett au début
agentImage.src = jettImage;  // Afficher Jett dès le début
agentImage.style.transform = "scale(1)";  // Taille normale pour Jett

// Fonction pour changer de personnage dans une boucle
function changeCharacter() {
    // Passer au prochain personnage
    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;

    const currentCharacter = characters[currentCharacterIndex];
    agentImage.src = currentCharacter;

    // Appliquer des effets spécifiques aux personnages
    if (currentCharacter === chamberImage) {
        agentImage.style.transform = `scale(1) translateX(${chamberOffsetX}px)`;  // Appliquer le décalage à Chamber sans agrandir
    } else if (currentCharacter === omenImage || currentCharacter === skyeImage) {
        agentImage.style.transform = "scale(1)";  // Taille normale pour Omen et Skye
    } else if (currentCharacter === neonImage) {
        agentImage.style.transform = "scale(1.1)";  // Agrandir Neon légèrement
    } else {
        agentImage.style.transform = "scale(1)";  // Taille normale pour Jett
    }

    // Réinitialiser la barre de vie à 100%
    health = 100;
    pixelHealthFill.style.width = health + "%";
}

// Lors du clic sur le personnage (Jett, etc.), la vie diminue
agentImage.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (health > 0) {
        health -= 5;
        pixelHealthFill.style.width = health + "%";
    }

    // Si la barre de vie atteint 0%, changer de personnage
    if (health <= 0) {
        changeCharacter();  // Alterner entre les personnages
    }
});
