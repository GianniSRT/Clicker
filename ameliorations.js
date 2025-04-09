fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const agentsList = document.getElementById('liste-agents');
        const armesList = document.getElementById('liste-armes');
        const competencesList = document.getElementById('liste-competences');

        // Affichage des agents
        data.ameliorations.agents.forEach(agent => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            // Création de l'élément image pour l'agent
            const img = document.createElement('img');
            img.src = agent.image; // Chemin de l'image de l'agent
            img.alt = agent.nom;    // Texte alternatif pour l'image
            img.className = 'agent-image'; // Optionnel : classe CSS pour styliser l'image
            img.style.width = '50px';  // Taille de l'image (à ajuster si nécessaire)

            // Création du texte pour l'agent
            const text = document.createElement('span');
            text.textContent = `${agent.nom} - ${agent.prix} pts`;

            // Ajout de l'image et du texte au li
            li.appendChild(img);
            li.appendChild(text);
            agentsList.appendChild(li);
        });

        // Affichage des armes
        data.ameliorations.armes.forEach(arme => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            // Création de l'élément image pour l'arme
            const img = document.createElement('img');
            img.src = arme.image; // Chemin de l'image de l'arme
            img.alt = arme.nom;   // Texte alternatif pour l'image
            img.className = 'arme-image'; // Optionnel : classe CSS pour styliser l'image
            img.style.width = '50px';  // Taille de l'image (à ajuster si nécessaire)

            // Création du texte pour l'arme
            const text = document.createElement('span');
            text.textContent = `${arme.nom} - ${arme.prix} pts`;

            // Ajout de l'image et du texte au li
            li.appendChild(img);
            li.appendChild(text);
            armesList.appendChild(li);
        });

        // Affichage des compétences
        data.ameliorations.competences.forEach(comp => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            // Création de l'élément image pour la compétence
            const img = document.createElement('img');
            img.src = comp.image; // Chemin de l'image de la compétence
            img.alt = comp.nom;   // Texte alternatif pour l'image
            img.className = 'competence-image'; // Optionnel : classe CSS pour styliser l'image
            img.style.width = '50px';  // Taille de l'image (à ajuster si nécessaire)

            // Création du texte pour la compétence
            const text = document.createElement('span');
            text.textContent = `${comp.nom} - ${comp.prix} pts`;

            // Ajout de l'image et du texte au li
            li.appendChild(img);
            li.appendChild(text);
            competencesList.appendChild(li);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));