window.addEventListener("DOMContentLoaded", () => {
  fetch('/api/check-auth')
    .then(res => res.json())
    .then(data => {
      const loginLink = document.getElementById('login-link');
      if (data.authenticated) {
        loginLink.textContent = data.username;
        loginLink.href = '/user.html';
      } else {
        loginLink.textContent = 'Login';
        loginLink.href = '/login.html';
      }
    })
    .catch(err => console.error("Errore nel controllo autenticazione:", err));
});
