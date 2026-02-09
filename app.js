(function () {
  'use strict';

  // TMDB API config — free API key for demo (read-only, public data)
  var TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
  var TMDB_BASE = 'https://api.themoviedb.org/3';
  var TMDB_IMG = 'https://image.tmdb.org/t/p/';

  // DOM references
  var fileInput = document.getElementById('file-input');
  var blurredLayer = document.getElementById('blurred-layer');
  var sharpImage = document.getElementById('sharp-image');
  var placeholder = document.getElementById('placeholder');
  var searchInput = document.getElementById('search-input');
  var searchBtn = document.getElementById('search-btn');
  var searchResults = document.getElementById('search-results');

  // Event listeners
  fileInput.addEventListener('change', handleFileSelect);
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSearch();
  });

  // ========== TMDB SEARCH ==========
  function handleSearch() {
    var query = searchInput.value.trim();
    if (!query) return;

    searchBtn.textContent = '...';
    searchResults.innerHTML = '';

    fetch(TMDB_BASE + '/search/movie?api_key=' + TMDB_API_KEY + '&query=' + encodeURIComponent(query))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchBtn.textContent = 'Search';
        renderResults(data.results || []);
      })
      .catch(function () {
        searchBtn.textContent = 'Search';
        searchResults.innerHTML = '<p style="color:#666;font-size:12px;">Search failed. Check connection.</p>';
      });
  }

  function renderResults(movies) {
    searchResults.innerHTML = '';

    // Filter to movies with poster images, take first 6
    var withPosters = movies.filter(function (m) { return m.backdrop_path; });
    var top = withPosters.slice(0, 6);

    if (top.length === 0) {
      searchResults.innerHTML = '<p style="color:#666;font-size:12px;">No results found.</p>';
      return;
    }

    top.forEach(function (movie) {
      var card = document.createElement('div');
      card.className = 'result-card';

      var img = document.createElement('img');
      img.src = TMDB_IMG + 'w342' + movie.poster_path;
      img.alt = movie.title;
      img.loading = 'lazy';

      var title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = movie.title;

      card.appendChild(img);
      card.appendChild(title);
      searchResults.appendChild(card);

      // Click to apply this movie's backdrop
      card.addEventListener('click', function () {
        var backdropURL = TMDB_IMG + 'w1280' + movie.backdrop_path;
        applyLayers(backdropURL);
      });
    });
  }

  // ========== FILE UPLOAD (demo/test) ==========
  function handleFileSelect(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    var prevSrc = sharpImage.src;
    if (prevSrc && prevSrc.startsWith('blob:')) {
      URL.revokeObjectURL(prevSrc);
    }

    var objectURL = URL.createObjectURL(file);

    var img = new Image();
    img.onload = function () {
      applyLayers(objectURL);
    };
    img.onerror = function () {
      URL.revokeObjectURL(objectURL);
    };
    img.src = objectURL;
  }

  // ========== SHARED: Apply layers ==========
  function applyLayers(imageURL) {
    // Layer 2: blurred background
    blurredLayer.style.backgroundImage = 'url("' + imageURL + '")';

    // Layer 4: sharp foreground with mask
    sharpImage.src = imageURL;
    sharpImage.classList.add('visible');

    // Hide placeholder
    placeholder.classList.add('hidden');

    // Reset file input
    fileInput.value = '';
  }
})();
