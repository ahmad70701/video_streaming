const BASE_URL = window.location.origin;

// Fetch video data from the API
fetch(`${BASE_URL}/api/videos/`)
  .then((response) => response.json())
  .then((data) => {
    const videoList = document.getElementById('video-list');

    data.forEach((video) => {
      // Create a video card
      const card = document.createElement('div');
      card.classList.add('video-card');

      // Title and description
      card.innerHTML = `
        <h2>${video.title}</h2>
        <p>${video.description}</p>
        <div class="resolution-links">
          ${video.fileUrl
            .map(
              (url) =>
                `<a href="video.html?url=${encodeURIComponent(
                  BASE_URL+'/public/' + url
                )}" target="_blank">${url.match(/\/(\d+p)\//)[1]}</a>`
            )
            .join('')}
        </div>
      `;

      // Append card to the grid
      videoList.appendChild(card);
    });
  })
  .catch((err) => console.error('Error fetching videos:', err));
