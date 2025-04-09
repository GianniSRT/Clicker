document.addEventListener('DOMContentLoaded', function () {
    const jett = document.querySelector('.agent.jett');  // Sélection de l'image Jett
    const scoreDisplay = document.getElementById('score');  // Sélection de l'élément pour afficher le score

    let score = 0;

    // Vérification de la sélection de l'image jett
    if (!jett) {
        console.error("L'image Jett n'a pas été trouvée !");
        return;
    }

    // Fonction de clic sur Jett
    jett.addEventListener('click', () => {
        console.log('Jett a été cliqué');  // Débogage pour voir si le clic est détecté
        score++;  // Incrémente le score de 1
        scoreDisplay.textContent = score;  // Met à jour l'affichage du score
    });

});
