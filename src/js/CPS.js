document.addEventListener('DOMContentLoaded', function () {
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

    // === UI & LOCALSTORAGE ===
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

    // === AGENT CLICK EVENT ===
    agentImage.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        totalClicks++;
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
    spawnBonusOrb();

    // Appliquer le crosshair uniquement sur l'orbe
    document.body.style.cursor = "auto";  // Curseur normal globalement
});
