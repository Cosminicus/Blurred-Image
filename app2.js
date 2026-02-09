(function () {
  'use strict';

  // TMDB API config
  var TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
  var TMDB_BASE = 'https://api.themoviedb.org/3';
  var TMDB_IMG = 'https://image.tmdb.org/t/p/';

  // DOM references
  var fileInput = document.getElementById('file-input');
  var colorLayer = document.getElementById('color-layer');
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

  // ========== VIBRANT COLOR EXTRACTION ==========
  function extractAndApplyColors(imageURL) {
    // Use a small TMDB size for faster color extraction
    var sampleURL = imageURL;
    // If it's a TMDB w1280 URL, swap to w342 for faster Vibrant sampling
    if (imageURL.indexOf(TMDB_IMG + 'w1280') === 0) {
      sampleURL = imageURL.replace(TMDB_IMG + 'w1280', TMDB_IMG + 'w342');
    }

    Vibrant.from(sampleURL)
      .getPalette()
      .then(function (palette) {
        applyColorGradient(palette);
      })
      .catch(function () {
        // Fallback: dark gradient if Vibrant fails
        colorLayer.style.background =
          'linear-gradient(180deg, #1a1a2e 0%, #000 100%)';
      });
  }

  function applyColorGradient(palette) {
    // Pick dominant color (prefer DarkVibrant, fallback chain)
    var primary = palette.DarkVibrant || palette.Vibrant || palette.Muted;
    var secondary = palette.DarkMuted || palette.Muted || palette.DarkVibrant;
    var accent = palette.Vibrant || palette.LightVibrant || palette.LightMuted;

    // Default fallbacks
    var primaryRgb = primary ? primary.getRgb() : [20, 20, 40];
    var secondaryRgb = secondary ? secondary.getRgb() : [0, 0, 0];
    var accentRgb = accent ? accent.getRgb() : [40, 40, 60];

    var c1 = 'rgb(' + Math.round(primaryRgb[0]) + ',' + Math.round(primaryRgb[1]) + ',' + Math.round(primaryRgb[2]) + ')';
    var c2 = 'rgb(' + Math.round(secondaryRgb[0]) + ',' + Math.round(secondaryRgb[1]) + ',' + Math.round(secondaryRgb[2]) + ')';
    var c3 = 'rgb(' + Math.round(accentRgb[0]) + ',' + Math.round(accentRgb[1]) + ',' + Math.round(accentRgb[2]) + ')';

    // Linear gradient top to bottom: accent → primary → secondary
    colorLayer.style.background =
      'linear-gradient(180deg, ' + c3 + ' 0%, ' + c1 + ' 50%, ' + c2 + ' 100%)';
  }

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

      card.addEventListener('click', function () {
        var backdropURL = TMDB_IMG + 'w1280' + movie.backdrop_path;
        applyLayers(backdropURL);
      });
    });
  }

  // ========== FILE UPLOAD ==========
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
    // Layer 4: sharp foreground with mask
    sharpImage.src = imageURL;
    sharpImage.classList.add('visible');

    // Hide placeholder
    placeholder.classList.add('hidden');

    // Layer 2: extract colors and apply gradient
    extractAndApplyColors(imageURL);

    // Reset file input
    fileInput.value = '';
  }
})();
