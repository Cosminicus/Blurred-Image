(function () {
  'use strict';

  // TMDB API config
  var TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
  var TMDB_BASE = 'https://api.themoviedb.org/3';
  var TMDB_IMG = 'https://image.tmdb.org/t/p/';

  // DOM references
  var fileInput = document.getElementById('file-input');
  var colorLayer = document.getElementById('color-layer');
  var colorWash = document.getElementById('color-wash');
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
    var sampleURL = imageURL;
    // Use w185 for Vibrant sampling (w342 is used by thumbnails — same URL
    // would hit the browser cache without CORS headers, tainting the canvas)
    if (imageURL.indexOf(TMDB_IMG + 'w1280') === 0) {
      sampleURL = imageURL.replace(TMDB_IMG + 'w1280', TMDB_IMG + 'w185');
    }

    Vibrant.from(sampleURL)
      .getPalette()
      .then(function (palette) {
        applyColorGradient(palette);
      })
      .catch(function () {
        // Fallback: dark gradient if Vibrant fails
        colorLayer.style.background =
          'linear-gradient(72deg, #000 0%, #1a1a2e 100%)';
        colorWash.style.background = 'none';
      });
  }

  function luminance(rgb) {
    return rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  }

  function toRgbStr(rgb) {
    return 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
  }

  function applyColorGradient(palette) {
    // Collect all available swatches, sort by brightness
    var names = ['Vibrant', 'DarkVibrant', 'LightVibrant', 'Muted', 'DarkMuted', 'LightMuted'];
    var swatches = [];
    names.forEach(function (n) {
      if (palette[n]) swatches.push(palette[n].getRgb());
    });

    if (swatches.length === 0) {
      colorLayer.style.background = 'linear-gradient(72deg, #000 0%, #1a1a2e 100%)';
      colorWash.style.background = 'none';
      return;
    }

    swatches.sort(function (a, b) { return luminance(a) - luminance(b); });

    // Darkest, middle, lightest — maximum contrast
    var dark = swatches[0];
    var mid = swatches[Math.floor(swatches.length / 2)];
    var light = swatches[swatches.length - 1];

    // Gradient 1: 2-color diagonal (72deg) — dark to mid
    colorLayer.style.background =
      'linear-gradient(72deg, ' + toRgbStr(dark) + ' 0%, ' + toRgbStr(mid) + ' 100%)';

    // Gradient 2: 1-color vertical wash (0deg) — lightest fading to transparent
    // CSS opacity: 0.5 is set in the stylesheet
    colorWash.style.background =
      'linear-gradient(0deg, ' + toRgbStr(light) + ' 0%, rgba(' +
        Math.round(light[0]) + ',' + Math.round(light[1]) + ',' + Math.round(light[2]) +
        ', 0) 100%)';
  }

  // ========== TMDB SEARCH ==========
  function handleSearch() {
    var query = searchInput.value.trim();
    if (!query) return;

    searchBtn.textContent = '...';
    clearResults();

    fetch(TMDB_BASE + '/search/movie?api_key=' + TMDB_API_KEY + '&query=' + encodeURIComponent(query))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchBtn.textContent = 'Search';
        renderResults(data.results || []);
      })
      .catch(function () {
        searchBtn.textContent = 'Search';
        showMessage('Search failed. Check connection.');
      });
  }

  function clearResults() {
    while (searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }
  }

  function showMessage(text) {
    clearResults();
    var p = document.createElement('p');
    p.style.color = '#666';
    p.style.fontSize = '12px';
    p.textContent = text;
    searchResults.appendChild(p);
  }

  function renderResults(movies) {
    clearResults();

    var withBackdrops = movies.filter(function (m) { return m.backdrop_path; });
    var top = withBackdrops.slice(0, 10);

    if (top.length === 0) {
      showMessage('No results found.');
      return;
    }

    top.forEach(function (movie) {
      var card = document.createElement('div');
      card.className = 'result-card';

      var img = document.createElement('img');
      img.src = TMDB_IMG + 'w342' + movie.backdrop_path;
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
    sharpImage.src = imageURL;
    sharpImage.classList.add('visible');
    placeholder.classList.add('hidden');
    extractAndApplyColors(imageURL);
    fileInput.value = '';
  }
})();
