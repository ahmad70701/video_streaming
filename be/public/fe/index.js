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
  .catch((error) => console.error('Error fetching videos:', error));
const nav = document.getElementById('nav');
const upload = document.getElementById('upload');
const login = document.getElementById('login');

fetch(`${BASE_URL}/api/auth/authenticate/`)
  .then((response) => {
    if (response.status === 401) {
      login.textContent = "Login/Signup";
      login.href = 'login.html';
      upload.href = 'login.html';
      console.log(response.status);
    } else if (response.status === 200) {
      login.textContent = "Logout";
      login.href = "#";
      login.setAttribute('onclick', "logout()");
      upload.href = 'upload.html';
    }
    nav.classList.remove('hidden');
    return response.json();
  })
  .then((data) => {
      console.log(data);
  })
  .catch((error) => console.error('Error fetching response!', error));

async function logout() {
  const response = await fetch(`${BASE_URL}/api/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    window.location.href = '/login.html';
  } else {
    console.error('Logout failed');
  }
}
