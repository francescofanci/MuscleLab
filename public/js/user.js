function formatDataNascita(dataIso) {
  const date = new Date(dataIso);
  const giorno = String(date.getDate()).padStart(2, '0');
  const mese = String(date.getMonth() + 1).padStart(2, '0');
  const anno = date.getFullYear();
  return `${giorno}-${mese}-${anno}`;
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("/api/user-info")
    .then(res => res.json())
    .then(data => {
      //popola iterfaccia
      document.getElementById("user-username").textContent = data.username;
      document.getElementById("user-name").textContent = data.nome;
      document.getElementById("user-surname").textContent = data.cognome;
      document.getElementById("user-email").textContent = data.email;
      document.getElementById("user-birthdate").textContent = formatDataNascita(data.data_nascita);

      //workout salvati
      const workoutList = document.getElementById("saved-workouts");
      workoutList.innerHTML = "";
      if (data.workouts && data.workouts.length > 0) {
        data.workouts.forEach(nome => {
          const li = document.createElement("li");
          li.classList.add("item-entry"); //classe per lo stile
          const link = document.createElement("a");
          link.href = `/challenge.html`;
          link.textContent = nome;
          li.appendChild(link);
          workoutList.appendChild(li);
        });
      } else {
        const msg = document.createElement("p");
        msg.className = "empty-msg";
        msg.innerHTML = `Non hai ancora salvato nessun workout. <a href="/challenge.html">Visualizza  gli allenamenti disponibili</a>`;
        workoutList.appendChild(msg);
      }

      //schede generate
      const plansList = document.getElementById("generated-plans");
      plansList.innerHTML = "";
      if (data.schede && data.schede.length > 0) {
        data.schede.forEach(s => {
          const li = document.createElement("li");
          li.classList.add("item-entry");
          const link = document.createElement("a");
          link.href = `/scheda-detail.html?id=${s.id}`;
          link.textContent = s.nome;

          // Bottone "cestino"
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "🗑️";
          deleteBtn.className = "delete-scheda";
          deleteBtn.addEventListener("click", () => {
            if (confirm(`Vuoi davvero eliminare la scheda "${s.nome}"?`)) {
              fetch(`/api/scheda/${s.id}`, {
                method: "DELETE"
              })
              .then(res => {
                if (res.ok) {
                  //rimuovi il <li> dalla lista
                  li.remove();
                } else {
                  throw new Error("Errore durante l'eliminazione");
                }
              })
              .catch(err => {
                console.error("Errore durante l'eliminazione:", err);
                alert("Impossibile eliminare la scheda.");
              });
            }
          });

          li.appendChild(link);
          li.appendChild(deleteBtn);
          plansList.appendChild(li);
        });
      } else {
        const msg = document.createElement("p");
        msg.className = "empty-msg";
        msg.innerHTML = `Non hai nessuna scheda salvata. <a href="/gen.html">Crea una nuova scheda personalizzata</a>`;
        plansList.appendChild(msg);
      }
    })
    .catch(err => console.error("Errore nel recupero dati utente:", err));

  // logout
  document.getElementById("logout-button").addEventListener("click", () => {
    fetch('/logout', {
      method: 'POST',
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/login.html';
      } else {
        alert('Errore durante il logout. Riprova.');
      }
    })
    .catch(err => {
      console.error('Errore nel logout:', err);
      alert('Errore nel logout. Riprova.');
    });
  });
});
