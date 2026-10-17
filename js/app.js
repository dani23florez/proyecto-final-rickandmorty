// ========================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES
// ========================================

// Escribe tus datos personales aquí
const developerName = "angie, saray, leidy";
const developerId = "66707";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los personajes favoritos
let favoritesArray = [];

// ========================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ========================================

const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');

// ========================================
// 3. FIRMA EN EL PIE DE PÁGINA
// ========================================

mainFooter.innerHTML = `<p>Developed with 💻 by <strong>${developerName}</strong> (ID: ${developerId})</p>`;

// ========================================
// 4. FUNCIÓN PARA OBTENER DATOS DE LA API
// ========================================

async function fetchData(endpoint) {
    try {
        // Mostramos un mensaje mientras cargan los datos
        dataContainer.innerHTML = '<p class="loading-text">Loading multiverse data...</p>';

        // Hacemos la petición a la API
        const response = await fetch(`${baseUrl}${endpoint}`);

        if (!response.ok) {
            throw new Error('No se pudieron obtener los datos');
        }

        const data = await response.json();

        // Devolvemos los resultados
        return data.results;

    } catch (error) {
        console.error("Error:", error);
        dataContainer.innerHTML = '<p class="loading-text" style="color: red;">Connection error.</p>';
        return [];
    }
}

// ========================================
// 5. FUNCIONES PARA MOSTRAR LOS DATOS
// ========================================

// Mostrar personajes
function renderCharacters(charactersData) {
    dataContainer.innerHTML = '';

    charactersData.forEach(character => {
        // Definimos el color según el estado
        const statusColor = character.status === 'Alive'
            ? 'lime'
            : (character.status === 'Dead' ? 'red' : 'gray');

        // Creamos la tarjeta del personaje
        const cardHTML = `
            <article class="data-card">
                <img src="${character.image}" alt="${character.name}">

                <div class="card-info">
                    <h2>${character.name}</h2>

                    <p class="info-label">
                        Status:
                        <span style="color: ${statusColor}">
                            ${character.status}
                        </span>
                    </p>

                    <p class="info-label">
                        Species: ${character.species}
                    </p>

                    <!-- Botón para guardar el personaje -->
                    <button class="btn-add-fav"
                        onclick="addToFavorites('${character.name}', '${character.image}')">
                        ⭐ Add to Favorites
                    </button>
                </div>
            </article>
        `;

        dataContainer.innerHTML += cardHTML;
    });
}

// Mostrar ubicaciones
function renderLocations(locationsData) {
    dataContainer.innerHTML = '';

    locationsData.forEach(location => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>🌍 ${location.name}</h2>

                    <p class="info-label">
                        Type: <span style="color: white;">${location.type}</span>
                    </p>

                    <p class="info-label">
                        Dimension: ${location.dimension}
                    </p>
                </div>
            </article>
        `;
    });
}

// Mostrar episodios
function renderEpisodes(episodesData) {
    dataContainer.innerHTML = '';

    episodesData.forEach(episode => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>📺 ${episode.name}</h2>

                    <p class="info-label">
                        Code: <span style="color: lime;">${episode.episode}</span>
                    </p>

                    <p class="info-label">
                        Air Date: ${episode.air_date}
                    </p>
                </div>
            </article>
        `;
    });
}

// ========================================
// 6. LÓGICA DE FAVORITOS (LOCALSTORAGE)
// ========================================

// Agregar un personaje a favoritos
function addToFavorites(name, image) {
    const newFavorite = {
        name: name,
        image: image
    };

    favoritesArray.push(newFavorite);

    // Guardamos los favoritos en el navegador
    localStorage.setItem(
        'myFavCharacters',
        JSON.stringify(favoritesArray)
    );

    alert(`¡${name} agregado a favoritos!`);
}

// Mostrar los personajes favoritos
function renderFavorites() {
    dataContainer.innerHTML = '';

    const savedData = localStorage.getItem('myFavCharacters');

    if (savedData) {
        favoritesArray = JSON.parse(savedData);

        if (favoritesArray.length === 0) {
            dataContainer.innerHTML =
                '<p class="loading-text">No favorites added yet.</p>';
            return;
        }

        // Mostramos cada personaje guardado
        favoritesArray.forEach(fav => {
            dataContainer.innerHTML += `
                <article class="data-card">
                    <img src="${fav.image}" alt="${fav.name}">

                    <div class="card-info">
                        <h2>⭐ ${fav.name}</h2>
                    </div>
                </article>
            `;
        });

    } else {
        dataContainer.innerHTML =
            '<p class="loading-text">No favorites added yet.</p>';
    }
}

// ========================================
// 7. MANEJO DE EVENTOS DEL MENÚ
// ========================================

// Resaltar el botón seleccionado
function setActiveButton(activeBtn) {
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

// Evento para mostrar personajes
btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);

    const data = await fetchData('/character');

    if (data) {
        renderCharacters(data);
    }
});

// Evento para mostrar ubicaciones
btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);

    const data = await fetchData('/location');

    if (data) {
        renderLocations(data);
    }
});

// Evento para mostrar episodios
btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);

    const data = await fetchData('/episode');

    if (data) {
        renderEpisodes(data);
    }
});

// Evento para mostrar favoritos
btnFavorites.addEventListener('click', () => {
    setActiveButton(btnFavorites);
    renderFavorites();
});

// ========================================
// 8. INICIO AUTOMÁTICO
// ========================================

// Recuperamos los favoritos guardados
const previousFavs = localStorage.getItem('myFavCharacters');

if (previousFavs) {
    favoritesArray = JSON.parse(previousFavs);
}

// Mostramos los personajes al abrir la página
btnCharacters.click();