const BASE_URL = window.location.origin;
document.getElementById("loginBtn").addEventListener('click',login);

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

async function login(e){
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const data = {"email":email,
      "password":password,
  }
  try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.location.href = '/upload.html';
  } catch (error) {
      console.error('Error while loggin in:', error);
  }   
}
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
  