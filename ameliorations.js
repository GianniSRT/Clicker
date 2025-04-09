fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const agentsList = document.getElementById('liste-agents');
        const armesList = document.getElementById('liste-armes');
        const competencesList = document.getElementById('liste-competences');

        // Affichage des agents sous forme de boutons
        data.ameliorations.agents.forEach(agent => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = agent.image;
            img.alt = agent.nom;
            img.className = 'agent-image me-2';
            img.style.width = '50px';

            const text = document.createElement('span');
            text.textContent = `${agent.nom} - ${agent.prix} pts`;

            btn.appendChild(img);
            btn.appendChild(text);
            agentsList.appendChild(btn);
        });

        // Affichage des armes sous forme de boutons
        data.ameliorations.armes.forEach(arme => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-success m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = arme.image;
            img.alt = arme.nom;
            img.className = 'arme-image me-2';
            img.style.width = '70px';

            const text = document.createElement('span');
            text.textContent = `${arme.nom} - ${arme.prix} pts`;

            btn.appendChild(img);
            btn.appendChild(text);
            armesList.appendChild(btn);
        });

        // Affichage des compétences sous forme de boutons
        data.ameliorations.competences.forEach(comp => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-warning m-1 d-flex align-items-center';

            const img = document.createElement('img');
            img.src = comp.image;
            img.alt = comp.nom;
            img.className = 'competence-image me-2';
            img.style.width = '50px';

            const text = document.createElement('span');
            text.textContent = `${comp.nom} - ${comp.prix} pts`;

            btn.appendChild(img);
            btn.appendChild(text);
            competencesList.appendChild(btn);
            
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
