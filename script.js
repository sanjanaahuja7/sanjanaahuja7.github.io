document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // Fetch project data from the JSON file
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(projects => {
            // Once data is fetched, build the portfolio
            buildPortfolio(projects);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            if (portfolioGrid) {
                portfolioGrid.innerHTML = '<p>Could not load projects. Please try again later.</p>';
            }
        });

    function buildPortfolio(projects) {
        if (!portfolioGrid) return;

        projects.forEach(project => {
            const projectBox = document.createElement('div');
            projectBox.classList.add('project-box');
            projectBox.innerHTML = `
                <img src="assets/${project.folder}/${project.header}" alt="${project.name}">
                <div class="project-overlay">
                    <div class="project-title">${project.name}</div>
                </div>
            `;
            projectBox.addEventListener('click', () => openModal(project));
            portfolioGrid.appendChild(projectBox);
        });
    }

    function openModal(project) {
        // Define your new R2 bucket base URL
        const assetBaseUrl = 'https://pub-a7dd156852ea4f32aa6c9f0aa5bc4fc6.r2.dev';
        let modalHTML = `<h2>${project.name}</h2>`;
        modalHTML += `<p class="project-description">${project.description}</p><hr>`;
        project.files.forEach(file => {
            // Construct the full URL using the base URL, project folder, and filename
            const filePath = `${assetBaseUrl}/${project.folder}/${file}`; 
            const fileExtension = file.split('.').pop().toLowerCase();
            
            if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                modalHTML += `<video controls><source src="${filePath}" type="video/${fileExtension}">Your browser does not support the video tag.</video>`;
            } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                modalHTML += `<img src="${filePath}" alt="${file}"><hr>`;
            }
        });

        modalBody.innerHTML = modalHTML;
        modal.style.display = 'block';
    }

    const closeModal = () => {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear content to stop videos from playing
    };

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});