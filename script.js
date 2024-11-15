const NASA_API_KEY = 'DEMO_KEY'; 
let currentPhotos = [];
let currentPhotoIndex = 0;

// DOM Elements
const roverImage = document.getElementById('roverImage');
const photoInfo = document.getElementById('photoInfo');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const roverSelect = document.getElementById('roverSelect');
const solInput = document.getElementById('solInput');
const fetchButton = document.getElementById('fetchButton');

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Navigation
prevButton.addEventListener('click', () => {
    if (currentPhotos.length > 0) {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        displayPhoto(currentPhotos[currentPhotoIndex]);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPhotos.length > 0) {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
        displayPhoto(currentPhotos[currentPhotoIndex]);
    }
});

// Fetch photos
fetchButton.addEventListener('click', fetchPhotos);

async function fetchPhotos() {
    const rover = roverSelect.value;
    const sol = solInput.value;

    // Show spinner inside the info-box
    photoInfo.innerHTML = `
        <div id="loadingSpinner" class="spinner"></div>
        <p>Loading rover information...</p>
    `;

    try {
        const response = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_API_KEY}`
        );
        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            currentPhotos = data.photos;
            currentPhotoIndex = 0;
            displayPhoto(currentPhotos[currentPhotoIndex]);
        } else {
            photoInfo.innerHTML = '<p>No photos found for the selected rover and sol.</p>';
            roverImage.src = '';
        }
    } catch (error) {
        console.error('Error fetching photos:', error);
        photoInfo.innerHTML = '<p>Error fetching photos. Please try again.</p>';
    } finally {
        // Remove spinner once loading is complete
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

function displayPhoto(photo) {
    roverImage.src = photo.img_src;
    roverImage.alt = `Mars Rover ${photo.rover.name} - ${photo.camera.full_name}`;
    
    photoInfo.innerHTML = `
        <h2>${photo.rover.name} Rover</h2>
        <p>Camera: ${photo.camera.full_name} (${photo.camera.name})</p>
        <p>Date: ${photo.earth_date}</p>
        <p>Sol: ${photo.sol}</p>
    `;
}

// Initial load
fetchPhotos();