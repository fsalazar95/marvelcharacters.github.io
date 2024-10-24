// Fetch Marvel characters data from the API
// Marvel API settings
const publicKey = '85b92dac58c7ee81d6db7be0d2e8f39b';
const privateKey = '7b7ac2ed2427b99d87169cc4d93b93fd377fe33d';
const ts = new Date().getTime();
const hash = md5(ts + privateKey + publicKey); // Necesitas la librería MD5

// HTML Elements
const searchButton = document.getElementById('searchButton');
const characterInput = document.getElementById('characterInput');
const characterResults = document.getElementById('characterResults');
const autocompleteResults = document.getElementById('autocompleteResults');

// Event listener for search button
searchButton.addEventListener('click', () => {
  const query = characterInput.value.toLowerCase();
  if (query) {
    fetchMarvelCharacters(query);
  }
});

// Event listener for Enter key in the input field
characterInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Verifica si la tecla presionada es Enter
      const query = characterInput.value.trim();
      if (query) {
        fetchMarvelCharacters(query); // Llama a la función de búsqueda
      }
    }
});

// Event listener for input in the search field
characterInput.addEventListener('input', () => {
    const query = characterInput.value.trim();
    if (query) {
        fetchAutocompleteSuggestions(query);
    } else {
        clearAutocomplete(); // Limpiar las sugerencias si no hay entrada
    }
});

// Fetch characters from Marvel API
async function fetchMarvelCharacters(query) {
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Character not found');
    const data = await response.json();
    displayCharacters(data.data.results);
  } catch (error) {
    console.error("Error fetching characters: ", error);
  }
}

// Fetch autocomplete suggestions from Marvel API
async function fetchAutocompleteSuggestions(query) {
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayAutocomplete(data.data.results);
    } catch (error) {
        console.error("Error fetching autocomplete suggestions: ", error);
    }
}

// Display characters in the results section
function displayCharacters(characters) {
  characterResults.innerHTML = ''; // Clear previous results
  characters.forEach(character => {
    const characterCard = document.createElement('div');
    characterCard.className = 'col-md-3'; // Define the column size
    characterCard.innerHTML = `
      <div class="card mb-3">
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
        </div>
      </div>
    `;
    characterResults.appendChild(characterCard); // Append the new card to the results
  });
}

// Display autocomplete suggestions
function displayAutocomplete(characters) {
    clearAutocomplete(); // Limpia las sugerencias anteriores
    if (characters.length > 0) {
        characters.forEach(character => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = character.name;

            // Event listener for suggestion click
            item.addEventListener('click', () => {
                characterInput.value = character.name; // Rellena el input con el nombre seleccionado
                clearAutocomplete(); // Limpia las sugerencias
                fetchMarvelCharacters(character.name); // Realiza la búsqueda
            });

            autocompleteResults.appendChild(item); // Añade la opción a la lista de sugerencias
        });
        autocompleteResults.style.display = 'block'; // Muestra las sugerencias
    } else {
        autocompleteResults.style.display = 'none'; // Oculta si no hay resultados
    }
}

// Clear autocomplete suggestions
function clearAutocomplete() {
    autocompleteResults.innerHTML = ''; // Limpia las sugerencias
    autocompleteResults.style.display = 'none'; // Oculta la lista
}
