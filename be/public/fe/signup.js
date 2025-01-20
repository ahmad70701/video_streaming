const BASE_URL = window.location.origin;
document.getElementById("signupBtn").addEventListener('click',signUp);

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


async function signUp(e){
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errors = document.getElementById('errors');
    const data = {"email":email,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "userName": userName
}
try {
    const response = await fetch(`${BASE_URL}/api/users/`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
    });
    if (!response.ok) {
        const data = await response.json();
        errors.innerHTML = '';
        data.errors.forEach(element => {
            const newItem = document.createElement('li');
            newItem.textContent = element.msg;
            console.log(newItem);
            errors.appendChild(newItem);
            console.log(element.msg);
            errors.classList.remove('hidden');
        });
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    window.location.href = '/login.html';
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