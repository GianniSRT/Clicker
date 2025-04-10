// Charger les crédits depuis le Local Storage ou initialiser à 1000
let credits = parseInt(localStorage.getItem('credits')) || 1000;

// Fonction pour sauvegarder les crédits dans le Local Storage
function saveCreditsToLocalStorage() {
    localStorage.setItem('credits', credits);
}

// Fonction pour mettre à jour l'affichage des crédits
function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById('currencyDisplay');
    if (creditsDisplay) {
        creditsDisplay.innerHTML = `
            <div class="score-container d-flex align-items-center text-light">
                <img src="assets/money.webp" alt="money" class="money-icon me-2" />
                <span id="score">${credits}</span>
            </div>
        `;
    }
}

// Fonction pour sauvegarder un élément dans le Local Storage
function saveItemToLocalStorage(item) {
    const ameliorations = JSON.parse(localStorage.getItem('ameliorations')) || {};
    const category = item.category || 'agents'; // Déterminer la catégorie
    if (!ameliorations[category]) ameliorations[category] = [];

    const index = ameliorations[category].findIndex(el => el.nom === item.nom);
    if (index !== -1) {
        ameliorations[category][index] = item;
    } else {
        ameliorations[category].push(item);
    }

    localStorage.setItem('ameliorations', JSON.stringify(ameliorations));
}

// Fonction pour obtenir les crédits actuels
function getCredits() {
    return parseInt(localStorage.getItem('credits')) || 0;
}

// Fonction pour définir les crédits
function setCredits(value) {
    credits = value;
    saveCreditsToLocalStorage();
    updateCreditsDisplay();
}

// Appliquer le multiplicateur lors de l'achat
function handlePurchase(item, btn, textElement) {
    const currentCredits = getCredits();
    if (currentCredits >= item.prix) {
        setCredits(currentCredits - item.prix);

        item.nombre_achat += 1;
        item.prix = Math.ceil(item.prix * (item.multiplicateur || 1.2));

        saveItemToLocalStorage(item);

        updateClickMultiplier(); // Met à jour le multiplicateur
        textElement.textContent = `${item.nom} - ${item.prix} pts ${item.nombre_achat}`;
        console.log(`${item.nom} acheté ! Nombre d'achats : ${item.nombre_achat}`);
    } else {
        alert('Crédits insuffisants !');
    }
}

// Charger les données et initialiser les éléments
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const agentsList = document.getElementById('liste-agents');
        const armesList = document.getElementById('liste-armes');
        const competencesList = document.getElementById('liste-competences');

        const savedAmeliorations = JSON.parse(localStorage.getItem('ameliorations')) || {};

        updateCreditsDisplay();

        // Agents
        data.ameliorations.agents.forEach(agent => {
            const saved = (savedAmeliorations.agents || []).find(a => a.nom === agent.nom);
            if (saved) {
                agent.nombre_achat = saved.nombre_achat;
                agent.prix = saved.prix;
            } else {
                agent.nombre_achat = agent.nombre_achat || 0;
            }
            agent.category = 'agents';

            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = agent.image;
            img.alt = agent.nom;
            img.className = 'agent-image me-2';
            img.style.width = '50px';

            const text = document.createElement('span');
            text.textContent = `${agent.nom} - ${agent.prix} pts ${agent.nombre_achat}`;

            btn.appendChild(img);
            btn.appendChild(text);
            agentsList.appendChild(btn);

            btn.addEventListener('click', () => handlePurchase(agent, btn, text));
        });

        // Armes
        data.ameliorations.armes.forEach(arme => {
            const saved = (savedAmeliorations.armes || []).find(a => a.nom === arme.nom);
            if (saved) {
                arme.nombre_achat = saved.nombre_achat;
                arme.prix = saved.prix;
            } else {
                arme.nombre_achat = arme.nombre_achat || 0;
            }
            arme.category = 'armes';

            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-success m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = arme.image;
            img.alt = arme.nom;
            img.className = 'arme-image me-2';
            img.style.width = '70px';

            const text = document.createElement('span');
            text.textContent = `${arme.nom} - ${arme.prix} pts ${arme.nombre_achat}`;

            btn.appendChild(img);
            btn.appendChild(text);
            armesList.appendChild(btn);

            btn.addEventListener('click', () => handlePurchase(arme, btn, text));
        });

        // Compétences
        data.ameliorations.competences.forEach(comp => {
            const saved = (savedAmeliorations.competences || []).find(c => c.nom === comp.nom);
            if (saved) {
                comp.nombre_achat = saved.nombre_achat;
                comp.prix = saved.prix;
            } else {
                comp.nombre_achat = comp.nombre_achat || 0;
            }
            comp.category = 'competences';

            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-warning m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = comp.image;
            img.alt = comp.nom;
            img.className = 'competence-image me-2';
            img.style.width = '50px';

            const text = document.createElement('span');
            text.textContent = `${comp.nom} - ${comp.prix} pts ${comp.nombre_achat}`;

            btn.appendChild(img);
            btn.appendChild(text);
            competencesList.appendChild(btn);

            btn.addEventListener('click', () => handlePurchase(comp, btn, text));
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
