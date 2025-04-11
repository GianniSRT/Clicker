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
    rankDisplay.textContent = `Rang : ${currentRank}`;
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
        rankDisplay.textContent = `Rang : ${currentRank}`;
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
    function spawnBonusOrb() {
        if (bonusOrbActive) return;

        bonusOrbActive = true;

        const orb = document.createElement('div');
        orb.classList.add('bonus-orb');
        orb.setAttribute('id', 'bonus-orb');

        const randomPosition = () => {
            const xPos = Math.random() * (window.innerWidth - 80) + window.innerWidth / 4;
            const yPos = Math.random() * (window.innerHeight - 80) + window.innerHeight / 4;
            orb.style.top = `${yPos}px`;
            orb.style.left = `${xPos}px`;
        };

        orb.style.position = 'absolute';
        orb.style.transition = 'all 0.5s ease';
        randomPosition();

        // Taille réduite et surposition au-dessus des autres éléments
        orb.style.width = "50px";  // Taille de l'orbe plus petite
        orb.style.height = "50px"; // Taille de l'orbe plus petite
        orb.style.pointerEvents = 'auto'; // Permet le clic sur l'orbe

        // Curseur personnalisé lorsque survol de l'orbe
        orb.addEventListener('mouseover', () => {
            document.body.style.cursor = 'url("assets/crosshair.png"), auto';  // Curseur crosshair
        });

        orb.addEventListener('mouseout', () => {
            document.body.style.cursor = 'auto';  // Retour à curseur normal
        });

        orb.addEventListener('click', () => {
            // Ajout des points en fonction du niveau
            let rewardPoints = 0;

            if (credits < 1000) {
                rewardPoints = 50;  // Bronze
            } else if (credits < 5000) {
                rewardPoints = 100;  // Argent
            } else if (credits < 10000) {
                rewardPoints = 200;  // Or
            } else {
                rewardPoints = 500;  // Diamant
            }

            credits += rewardPoints;
            updateCreditsDisplay();

            // Déplacement rapide avant disparition
            randomPosition();
            setTimeout(() => {
                orb.remove();
                bonusOrbActive = false;
                setTimeout(spawnBonusOrb, Math.random() * 10000 + 5000); // Réapparition rapide
            }, 200);  // Disparition plus rapide
        });

        document.getElementById('overlay').appendChild(orb);

        // Disparition normale si non cliqué
        setTimeout(() => {
            if (orb && orb.parentElement) {
                orb.remove();
                bonusOrbActive = false;
                setTimeout(spawnBonusOrb, Math.random() * 10000 + 5000); // Réapparition rapide
            }
        }, 3000);  // Temps réduit avant disparition
    }

    // === INIT ===
    updateClickMultiplier();
    updateCreditsDisplay();
    updateRank(); // Mettre à jour le rang au chargement
    updateRankProgress(); // Mettre à jour la barre de progression au chargement
    startAutoClickers(); // Démarrer les clics automatiques
});
