
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const formTitle = document.getElementById("form-title");

//mostra registrazione e nascondi login
document.getElementById("show-register").addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
    formTitle.textContent = "Registrati";
});
//mostra login e nascondi registrazione
document.getElementById("show-login").addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    formTitle.textContent = "Accedi";
});

//login
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/user.html";
        } else {
            alert("Credenziali errate. Riprova.");
        }
    })
    .catch(error => {
        console.error("Errore durante il login:", error);
        alert("Errore di connessione al server.");
    });
});

//registrazione
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = registerForm.querySelector("#nome").value;
    const cognome = registerForm.querySelector("#cognome").value;
    const username = registerForm.querySelector("#username").value;
    const data_nascita = registerForm.querySelector("#data_nascita").value;
    const email = registerForm.querySelector("#email").value;
    const password = registerForm.querySelector("#password").value;

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cognome, username, email, password, data_nascita }),
    });

    if (response.ok) {
        const message = await response.text();
        alert(message);
        //vai al login
        document.getElementById("show-login").click();
    } else {
        alert("Errore nella registrazione: " + (await response.text()));
    }
});