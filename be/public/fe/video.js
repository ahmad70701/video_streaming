const params = new URLSearchParams(window.location.search);
const videoUrl = params.get('url');

const player = videojs('video-player');
player.src({ src: videoUrl, type: 'application/x-mpegURL' });


const BASE_URL = window.location.origin;
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
    // credentials: 'include',
});

if (response.ok) {
    window.location.href = '/login.html';
} else {
    console.error('Logout failed');
}
}