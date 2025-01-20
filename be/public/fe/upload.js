const baseUrl = window.location.origin;

fetch(`${baseUrl}/api/auth/authenticate/`)
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
const response = await fetch(`${baseUrl}/api/auth/logout/`, {
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