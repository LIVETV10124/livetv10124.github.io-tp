// DOM elements
const grid = document.getElementById("tv-grid");
const searchBar = document.getElementById("search-bar");
const filterCategory = document.getElementById("filter-category");
const importPlaylistBtn = document.getElementById("import-playlist");

// Default channels array
let channels = [];

// Function to display channels
function displayChannels(filter = "all", search = "") {
  grid.innerHTML = ""; // Clear grid
  const filteredChannels = channels.filter(channel => {
    const matchesCategory = filter === "all" || channel.category === filter;
    const matchesSearch = channel.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filteredChannels.forEach(channel => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div onclick="playChannel('${channel.url}', '${channel.name}', '${channel.drm_license_url}', '${channel.drm_scheme}', '${channel.userAgent}')">
        <img src="${channel.logo}" alt="${channel.name}">
        <div class="info">
          <h3>${channel.name}</h3>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Function to play a channel using JW Player
function playChannel(url, name, drmLicenseUrl, drmScheme, userAgent) {
  // Remove existing player popup if present
  const existingPopup = document.getElementById("player-popup");
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }

  // Create player popup
  const playerContainer = document.createElement("div");
  playerContainer.id = "player-popup";
  playerContainer.innerHTML = `
    <div id="player-container">
      <button id="close-player">Close</button>
      <div id="player"></div>
    </div>
  `;
  document.body.appendChild(playerContainer);

  // JW Player setup
  const playerConfig = {
    file: url,
    title: name,
    width: "100%",
    height: "100%",
    licenseKey: "KB5zFt7A", // Replace with your JW Player license key
  };

  // Add DRM if provided
  if (drmLicenseUrl && drmScheme) {
    playerConfig.drm = {
      [drmScheme]: { url: drmLicenseUrl },
    };
  }

  // Add custom user agent if provided
  if (userAgent) {
    playerConfig.headers = {
      "User-Agent": userAgent,
    };
  }

  jwplayer("player").setup(playerConfig);

  // Close player functionality
  document.getElementById("close-player").onclick = () => {
    document.body.removeChild(playerContainer);
  };
}

// Import playlist functionality
importPlaylistBtn.addEventListener("click", async () => {
  const url = "https://raw.githubusercontent.com/LIVETV10124/livetv10124.github.io/refs/heads/main/channels.json";
  try {
    const response = await fetch(url);
    const playlist = await response.json();

    channels = playlist.map(item => ({
      name: item.name || "Unnamed Channel",
      logo: item.logo || "assets/default-logo.png",
      drm_license_url: item.drm_license_url || null,
      drm_scheme: item.drm_scheme || null,
      userAgent: extractUserAgent(item.url),
      url: cleanUrl(item.url),
      category: "others", // Default category
    }));

    displayChannels();
    alert("Playlist imported successfully!");
  } catch (error) {
    alert("Failed to import playlist. Please check the URL and try again.");
  }
});

// Extract user-agent from URL
function extractUserAgent(url) {
  const match = url.match(/user-agent=["']([^"']+)["']/);
  return match ? match[1] : null;
}

// Clean URL (remove user-agent headers from the URL itself)
function cleanUrl(url) {
  return url.replace(/(\|user-agent=.*$)/, "");
}

// Event listeners for search and filter
searchBar.addEventListener("input", () => {
  displayChannels(filterCategory.value, searchBar.value);
});
filterCategory.addEventListener("change", () => {
  displayChannels(filterCategory.value, searchBar.value);
});

// Initial display (empty until playlist is imported)
displayChannels();
