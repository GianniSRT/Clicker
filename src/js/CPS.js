document.addEventListener('DOMContentLoaded', function () {
    // Charger la musique de fond
    const backgroundMusic = new Audio('assets/mp3/theme.mp3');
    backgroundMusic.loop = true; // Répéter la musique en boucle
    backgroundMusic.volume = 0.5; // Régler le volume (0.0 à 1.0)
    backgroundMusic.play().catch(error => {
        console.warn("La musique de fond n'a pas pu être jouée automatiquement :", error);
    });

    // Ajouter un bouton pour activer/désactiver la musique (optionnel)
    const musicToggleButton = document.createElement('button');
    musicToggleButton.textContent = "🎵 Activer/Désactiver la musique";
    musicToggleButton.className = "btn btn-secondary position-fixed bottom-0 end-0 m-3";
    document.body.appendChild(musicToggleButton);

    let isMusicPlaying = true;
    musicToggleButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggleButton.textContent = "🎵 Activer la musique";
        } else {
            backgroundMusic.play();
            musicToggleButton.textContent = "🎵 Désactiver la musique";
        }
        isMusicPlaying = !isMusicPlaying;
    });

    const jett = document.querySelector('.agent.jett');
    const agentImage = document.querySelector('.agent');
    const scoreDisplay = document.getElementById('currencyDisplay');
    const pixelHealthFill = document.getElementById("pixel-health-fill");

    if (!jett || !agentImage || !scoreDisplay || !pixelHealthFill) {
        console.error("L'un des éléments essentiels (Jett, agent, scoreDisplay ou pixelHealthFill) est manquant !");
        return;
    }

    // === INIT VARIABLES ===
    let credits = parseInt(localStorage.getItem('credits')) || 1000;
    let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    let unlockedSucces = JSON.parse(localStorage.getItem('unlockedSucces')) || [];
    let clickTimestamps = [];
    let currentStreak = 0;
    let lastAgent = '';
    let inactivityTimer = null;
    let clickMultiplier = 1;
    let health = 100;
    let bonusOrbActive = false;

    const characters = [
        'assets/Jett.gif',
        'assets/Chamber.gif',
        'assets/Neon.gif',
        'assets/Omen.gif',
        'assets/Skye.gif'
    ];
    let currentCharacterIndex = 0;
    const chamberOffsetX = 7;

    // Ajouter une instance Audio pour le son de clic
    const clickSound = new Audio('assets/mp3/click.mp3');

    // === LISTE DES RANGS ===
    const ranks = [
        { name: "Iron 1", clicks: 0 },
        { name: "Iron 2", clicks: 100 },
        { name: "Iron 3", clicks: 200 },
        { name: "Bronze 1", clicks: 300 },
        { name: "Bronze 2", clicks: 400 },
        { name: "Bronze 3", clicks: 500 },
        { name: "Silver 1", clicks: 700 },
        { name: "Silver 2", clicks: 900 },
        { name: "Silver 3", clicks: 1100 },
        { name: "Gold 1", clicks: 1400 },
        { name: "Gold 2", clicks: 1700 },
        { name: "Gold 3", clicks: 2000 },
        { name: "Platinum 1", clicks: 2500 },
        { name: "Platinum 2", clicks: 3000 },
        { name: "Platinum 3", clicks: 3500 },
        { name: "Diamond 1", clicks: 4000 },
        { name: "Diamond 2", clicks: 5000 },
        { name: "Diamond 3", clicks: 6000 },
        { name: "Immortal 1", clicks: 8000 },
        { name: "Immortal 2", clicks: 10000 },
        { name: "Immortal 3", clicks: 12000 },
        { name: "Radiant", clicks: 15000 }
    ];

    let currentRank = "Iron 1"; // Rang initial

    // === UI ELEMENTS ===
    const rankDisplay = document.createElement('div');
    rankDisplay.className = "rank-display position-fixed top-0 start-50 translate-middle-x mt-3 p-2 text-light";
    rankDisplay.style.backgroundColor = "#1c2533";
    rankDisplay.style.border = "2px solid #ff4655";
    rankDisplay.style.borderRadius = "10px";
    rankDisplay.style.boxShadow = "0 0 10px rgba(255, 70, 85, 0.8)";
    rankDisplay.style.fontSize = "1.2rem";
    document.body.appendChild(rankDisplay);

    // === CRÉER LA CARTE DES RANGS ===
    const rankCard = document.createElement('div');
    rankCard.className = "rank-card position-fixed bottom-0 start-0 m-3 p-3 text-light";
    rankCard.innerHTML = `
        <h5 class="rank-title">Progression des Rangs</h5>
        <div class="rank-info">
            <span id="current-rank">${currentRank}</span>
            <span id="next-rank">${ranks[1].name}</span>
        </div>
        <div class="progress rank-progress">
            <div id="rank-progress-bar" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;
    document.body.appendChild(rankCard);

    // === UI UPDATE FUNCTIONS ===
    function updateCreditsDisplay() {
        scoreDisplay.innerHTML = `
            <div class="score-container d-flex align-items-center text-light">
                <img src="assets/money.webp" alt="money" class="money-icon me-2" />
                <span id="score">${Math.floor(credits)}</span>
            </div>
        `;
    }

    function saveCreditsToLocalStorage() {
        localStorage.setItem('credits', Math.floor(credits));
    }

    function saveClicks() {
        localStorage.setItem('totalClicks', totalClicks);
        localStorage.setItem('unlockedSucces', JSON.stringify(unlockedSucces));
    }

    function showSuccesPopup(title) {
        const popup = document.createElement('div');
        popup.classList.add('modal', 'fade');
        popup.innerHTML = ` 
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Succès débloqué !</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        const bsModal = new bootstrap.Modal(popup);
        bsModal.show();
        popup.addEventListener('hidden.bs.modal', () => popup.remove());
    }

    function unlockSucces(key, title, reward = 50) {
        if (!unlockedSucces.includes(key)) {
            unlockedSucces.push(key);
            credits += reward;
            showSuccesPopup(`${title} (+${reward} crédits)`);
            saveCreditsToLocalStorage();
            saveClicks();
            updateCreditsDisplay();
        }
    }

    function updateClickMultiplier() {
        const ameliorations = JSON.parse(localStorage.getItem('ameliorations')) || {};
        let totalMultiplier = 1;

        ['agents', 'armes', 'competences'].forEach(category => {
            if (ameliorations[category]) {
                ameliorations[category].forEach(item => {
                    totalMultiplier += (item.nombre_achat || 0) * (item.multiplicateur || 1);
                });
            }
        });

        clickMultiplier = Math.floor(totalMultiplier);
    }

    function changeCharacter() {
        currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
        const currentCharacter = characters[currentCharacterIndex];
        agentImage.src = currentCharacter;

        if (currentCharacter.includes("Chamber")) {
            agentImage.style.transform = `scale(1) translateX(${chamberOffsetX}px)`;
        } else if (currentCharacter.includes("Neon")) {
            agentImage.style.transform = "scale(1.1)";
        } else {
            agentImage.style.transform = "scale(1)";
        }

        health = 100;
        pixelHealthFill.style.width = health + "%";
    }

    // === FONCTION POUR METTRE À JOUR LE RANG ===
    function updateRank() {
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (totalClicks >= ranks[i].clicks) {
                currentRank = ranks[i].name;
                break;
            }
        }
    }

    // === METTRE À JOUR LA BARRE DE PROGRESSION ===
    function updateRankProgress() {
        let currentRankIndex = 0;
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (totalClicks >= ranks[i].clicks) {
                currentRankIndex = i;
                break;
            }
        }

        const currentRank = ranks[currentRankIndex];
        const nextRank = ranks[currentRankIndex + 1] || currentRank; // Si Radiant, pas de rang suivant
        const progressToNextRank = nextRank.clicks - currentRank.clicks;
        const clicksInCurrentRank = totalClicks - currentRank.clicks;
        const progressPercentage = Math.min((clicksInCurrentRank / progressToNextRank) * 100, 100);

        // Mettre à jour les éléments de la carte
        document.getElementById('current-rank').textContent = currentRank.name;
        document.getElementById('next-rank').textContent = nextRank.name;
        const progressBar = document.getElementById('rank-progress-bar');
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    }

    // Fonction pour démarrer les clics automatiques des agents
    function startAutoClickers() {
        const ameliorations = JSON.parse(localStorage.getItem('ameliorations')) || {};
        const agents = ameliorations.agents || [];

        agents.forEach(agent => {
            if (agent.nombre_achat > 0) {
                setInterval(() => {
                    // Calcul du gain automatique : nombre d'agents * multiplicateur
                    const gain = agent.nombre_achat * (agent.multiplicateur || 1);
                    credits += gain;
                    saveCreditsToLocalStorage();
                    updateCreditsDisplay();
                    console.log(`Gain automatique de ${gain} crédits grâce à ${agent.nom} (${agent.nombre_achat} agents, multiplicateur : ${agent.multiplicateur || 1})`);
                }, 1000); // Intervalle de 1 seconde
            }
        });
    }

    // === AGENT CLICK EVENT ===
    agentImage.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Jouer le son de clic
        clickSound.currentTime = 0; // Réinitialise le son pour qu'il puisse être rejoué rapidement
        clickSound.play();

        totalClicks++;
        updateRank(); // Mettre à jour le rang après chaque clic
        updateRankProgress(); // Mettre à jour la barre de progression après chaque clic

        if (totalClicks === 1) unlockSucces("premier", "Premier tir");

        const now = Date.now();
        clickTimestamps.push(now);
        clickTimestamps = clickTimestamps.filter(ts => now - ts < 5000);
        if (clickTimestamps.length >= 10) unlockSucces("eco", "Eco Round?");

        if (health <= 5) unlockSucces("clutch", "Clutch");

        credits += clickMultiplier;

        if (health > 0) {
            health -= 5;
            pixelHealthFill.style.width = health + "%";
        }

        if (health <= 0) {
            if (agentImage.src.includes("Jett")) unlockSucces("jett", "Jett-diff");

            if (lastAgent !== agentImage.src) {
                currentStreak++;
                lastAgent = agentImage.src;
            }

            if (currentStreak >= 5) unlockSucces("ace", "Ace");

            changeCharacter();
        }

        if (agentImage.src.includes("Chamber")) {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                unlockSucces("afk", "Afk Chamber");
            }, 10000);
        }

        saveCreditsToLocalStorage();
        saveClicks();
        updateCreditsDisplay();
    });

    // === BONUS ORB ===
    function spawnBonusOrbs(count = 3) { // Nombre d'orbes à faire apparaître
        if (bonusOrbActive) return;

        bonusOrbActive = true;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const orb = document.createElement('div');
                orb.classList.add('bonus-orb');
                orb.setAttribute('id', `bonus-orb-${i}`);

                const randomPosition = () => {
                    const xPos = Math.random() * (window.innerWidth - 100); // Position X aléatoire
                    const yPos = Math.random() * (window.innerHeight - 100); // Position Y aléatoire
                    orb.style.top = `${yPos}px`;
                    orb.style.left = `${xPos}px`;
                };

                // Style de l'orbe
                orb.style.position = 'absolute';
                orb.style.transition = 'all 0.5s ease';
                orb.style.width = "80px"; // Taille de la hitbox (plus grande)
                orb.style.height = "80px"; // Taille de la hitbox (plus grande)
                orb.style.backgroundColor = "transparent"; // Fond transparent pour la hitbox
                orb.style.borderRadius = "50%"; // Forme circulaire
                orb.style.cursor = 'pointer'; // Curseur pointer pour indiquer qu'il est cliquable
                orb.style.transform = "translate(-50%, -50%)"; // Recentre la hitbox
                randomPosition();

                // Ajouter un élément enfant pour l'apparence visuelle de l'orbe
                const orbVisual = document.createElement('div');
                orbVisual.style.width = "50px"; // Taille visible de l'orbe
                orbVisual.style.height = "50px"; // Taille visible de l'orbe
                orbVisual.style.backgroundColor = "#ff4655"; // Couleur rouge Valorant
                orbVisual.style.borderRadius = "50%"; // Forme circulaire
                orbVisual.style.boxShadow = "0 0 15px rgba(255, 70, 85, 0.8)";
                orbVisual.style.position = "absolute";
                orbVisual.style.top = "50%";
                orbVisual.style.left = "50%";
                orbVisual.style.transform = "translate(-50%, -50%)"; // Recentre l'apparence visuelle

                // Ajouter un logo d'œil à l'intérieur de l'orbe
                const eyeLogo = document.createElement('img');
                eyeLogo.src = "assets/reyna-oeil.png"; // Chemin vers l'image du logo d'œil
                eyeLogo.alt = "Eye Logo";
                eyeLogo.style.width = "30px";
                eyeLogo.style.height = "30px";
                eyeLogo.style.position = "absolute";
                eyeLogo.style.top = "50%";
                eyeLogo.style.left = "50%";
                eyeLogo.style.transform = "translate(-50%, -50%)"; // Centrer le logo
                orbVisual.appendChild(eyeLogo);

                orb.appendChild(orbVisual);

                // Ajouter un événement de clic sur l'orbe
                orb.addEventListener('click', () => {
                    const rewardPoints = Math.floor(Math.random() * 50) + 10; // Récompense aléatoire entre 10 et 50
                    credits += rewardPoints;
                    updateCreditsDisplay();

                    // Afficher "+X" après le clic
                    const rewardText = document.createElement('div');
                    rewardText.textContent = `+${rewardPoints}`;
                    rewardText.style.position = 'absolute';
                    rewardText.style.top = orb.style.top;
                    rewardText.style.left = orb.style.left;
                    rewardText.style.transform = "translate(-50%, -50%)";
                    rewardText.style.color = "#ff4655";
                    rewardText.style.fontSize = "1.5rem";
                    rewardText.style.fontWeight = "bold";
                    rewardText.style.textShadow = "0 0 10px rgba(255, 70, 85, 0.8)";
                    rewardText.style.animation = "fadeOut 1s ease forwards";
                    document.body.appendChild(rewardText);

                    // Supprimer le texte après l'animation
                    setTimeout(() => rewardText.remove(), 1000);

                    // Déplacement rapide avant disparition
                    orb.style.transform = "scale(1.5)"; // Animation d'agrandissement
                    setTimeout(() => {
                        orb.remove();
                    }, 200); // Disparition rapide
                });

                // Ajouter l'orbe au DOM
                document.body.appendChild(orb);

                // Disparition automatique si non cliqué
                setTimeout(() => {
                    if (orb && orb.parentElement) {
                        orb.remove();
                    }
                }, 5000); // Temps avant disparition
            }, i * (Math.random() * 1000 + 1000)); // Délai entre 1 et 2 secondes pour chaque orbe
        }

        // Réapparition des orbes après un délai aléatoire
        setTimeout(() => {
            bonusOrbActive = false;
            spawnBonusOrbs(count); // Réapparition des orbes
        }, Math.random() * 10000 + 5000); // Intervalle aléatoire entre 5 et 15 secondes
    }

    // === INIT ===
    updateClickMultiplier();
    updateCreditsDisplay();
    updateRank(); // Mettre à jour le rang au chargement
    updateRankProgress(); // Mettre à jour la barre de progression au chargement
    startAutoClickers(); // Démarrer les clics automatiques

    // === INIT BONUS ORBS ===
    spawnBonusOrbs(5); // Faire apparaître 5 orbes
});
