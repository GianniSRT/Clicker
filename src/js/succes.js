document.addEventListener("DOMContentLoaded", () => {
    const succesContainer = document.getElementById("succes");
    const allSucces = {
        premier: {
            title: "Premier tir",
            description: "Tu as décroché le premier kill de la partie.",
            img: "assets/pngtree-pixel-golden-trophy-the-winner-trophy-cup-pixel-art-with-sparkle-png-image_12193297.png",
            sound: "https://www.myinstants.com/instant/reaverkill1-61008/embed/"
        },
        eco: {
            title: "Eco Round?",
            description: "Gagné un round sans budget. Respect.",
            img: "assets/ghost.png",
            sound: "https://www.myinstants.com/instant/economie-economie-la-team-89149/embed/"
        },
        jett: {
            title: "Jett-diff",
            description: "Tu as humilié l'autre Jett. C'est toi le vrai main.",
            img: "assets/couteaujett.png",
            sound: "https://www.myinstants.com/instant/jett-ace-48852/embed/"
        },
        ace: {
            title: "Ace",
            description: "5 kills. Juste toi. Machine.",
            img: "assets/ace.png",
            sound: "https://www.myinstants.com/instant/valorant-1-5-kills-sounds-with-ace-sound-81295/embed/"
        },
        clutch: {
            title: "Clutch",
            description: "Tu as retourné la situation en solo.",
            img: "assets/clutch.png",
            sound: "https://www.myinstants.com/instant/clutch-moment-92474/embed/"
        },
        afk: {
            title: "Afk Chamber",
            description: "Tu as profité d'un Chamber AFK. Opportuniste 👀",
            img: "assets/chamber.jpg",
            sound: "https://www.myinstants.com/instant/white-tee-rizz-82917/embed/"
        }
    };

    const unlocked = JSON.parse(localStorage.getItem("unlockedSucces")) || [];

    // Trier les succès (débloqués en premier)
    const sortedSucces = Object.entries(allSucces).sort(([keyA], [keyB]) => {
        const aUnlocked = unlocked.includes(keyA);
        const bUnlocked = unlocked.includes(keyB);
        return bUnlocked - aUnlocked;
    });

    succesContainer.innerHTML = sortedSucces.map(([key, s]) => {
        const isUnlocked = unlocked.includes(key);
        
        return `
        <div class="col">
            <div class="card p-3 ${isUnlocked ? "" : "locked"}" data-key="${key}">
                <img src="${s.img}" alt="${s.title}" class="${isUnlocked ? "" : "img-locked"}">
                <div class="card-content">
                    <h3 class="card-title">${isUnlocked ? s.title : '<i class="fas fa-lock"></i> Succès verrouillé'}</h3>
                    <p class="card-description">${isUnlocked ? s.description : 'Débloquez ce succès en jouant !'}</p>
                    ${isUnlocked ? `
                    <div class="d-flex justify-content-center">
                        <iframe width="100%" height="60" src="${s.sound}" frameborder="0"></iframe>
                    </div>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
});