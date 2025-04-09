document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const cardSections = document.querySelectorAll('.card-section');
    const mainContent = document.getElementById('mainContent');
    const neon = document.querySelector('.agent.neon');
    const scoreDisplay = document.getElementById('score');

    let score = 0;

    function toggleSidebar() {
        sidebar.classList.toggle('show');
        overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
        mainContent.classList.toggle('shifted');
    }

    function changeSection(targetId) {
        cardSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');

        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === targetId) {
                item.classList.add('active');
            }
        });

        if (window.innerWidth < 992) {
            toggleSidebar();
        }
    }

    sidebarToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            changeSection(this.dataset.target);
        });
    });

    changeSection('jeu');

    // 🎯 Fonction de click sur Neon
    neon.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;
    });
});
