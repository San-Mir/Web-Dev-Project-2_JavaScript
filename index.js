import apiKey from "./config";

// DOM elements
const movieCardsContainer = document.getElementById("movie-cards");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const categoryBtn = document.getElementById("category-btn");

// Create a movie card
function createMovieCard(movie) {
  const { title, poster_path, id } = movie;
  const placeholderImage = "https://via.placeholder.com/500x750?text=No+Image";
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
    : placeholderImage;
  const movieCard = `
  <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
    <a href="https://www.themoviedb.org/movie/${id}" class="card border-0 overflow-hidden movie-card position-relative">
      <img class="card-img-top" src="${imageUrl}" alt="${title}" onerror="if (this.src != 'error.jpg') this.src = 'error.jpg';">
      <div style="--bs-bg-opacity: .7;" class="position-absolute bg-dark bottom-0 p-2 text-info text-truncate w-100" target="_blank">${title}</div>
    </a>
  </div>
`;
  return movieCard;
}

// Display movies on the page
function displayMovies(movies) {
  if (movies.length > 0) {
    const movieCards = movies.map((movie) => createMovieCard(movie));
    movieCardsContainer.innerHTML = movieCards.join("");
  } else {
    // Display a message if no movies found
    movieCardsContainer.innerHTML = '<p class="text-info">No movies found.</p>';
  }
}

// Fetch movies from the API and display on the page
async function fetchMovies(search, category) {
  // Build the API URL
  const apiUrl = search
    ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${search}&with_genres=${category}`
    : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_genres=${category}`;

  // Clear the movie cards container and display the loader
  movieCardsContainer.innerHTML = "";
  loader.style.display = "flex";

  // Fetch movies from the API
  const res = await fetch(apiUrl);
  const data = await res.json();
  const movies = data.results;

  // Display movies on the page
  displayMovies(movies);

  // Hide the loader
  loader.style.display = "none";
}

// Close the navbar when clicked outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".navbar-collapse") &&
    document.querySelector(".navbar-collapse").classList.contains("show")
  ) {
    document.querySelector(".navbar-toggler").click();
  }
});

// Event listeners for search and category filter
searchInput.addEventListener("input", () => {
  const search = searchInput.value;
  // Reset the category select as search doesn't work with categories
  categoryBtn.innerText = "All";
  // Fetch movies with the search term
  fetchMovies(search, "");
});

// Display in the category select dropdown
function displayGenres(genres) {
  const categoryOptions = genres.map((genre) => {
    return `<li class="dropdown-item" value="${genre.id}">${genre.name}</li>`;
  });
  // Add "All" categories option
  categoryOptions.unshift('<li class="dropdown-item" value="">All</li>');
  categorySelect.innerHTML = categoryOptions.join("");

  // Event listener for category select dropdown options
  categorySelect.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.value || "";
      categoryBtn.innerText = item.innerText;
      // Reset the search input as categories don't work with search
      searchInput.value = "";
      // Fetch movies with the category
      fetchMovies("", category);
    });
  });
}

// Fetch genres from the API and display in the category select dropdown
async function fetchGenres() {
  const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  const res = await fetch(genresUrl);
  const data = await res.json();
  const genres = data.genres;
  displayGenres(genres);
}

// Fetch genres and movies when the page loads
fetchGenres();
fetchMovies("", "");
