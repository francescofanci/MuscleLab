
  function aggiungiRiga() {
    const tbody = document.querySelector("#workout-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" placeholder="Es. Schiena"></td>
      <td><input type="text" placeholder="Es. Lat Machine"></td>
      <td><input type="number" min="1" placeholder="3"></td>
      <td><input type="number" min="1" placeholder="10"></td>
      <td><button onclick="rimuoviRiga(this)">🗑️</button></td>
    `;
    tbody.appendChild(row);
  }

  function rimuoviRiga(button) {
    button.closest("tr").remove();
  }

document.getElementById("salva-btn-scheda").addEventListener("click", () => {
  //controllo nome
  const nomeScheda = document.getElementById("nome-scheda").value.trim();
  if (!nomeScheda) {
    alert("Inserisci un nome per la scheda!");
    return;
  }

  const righe = document.querySelectorAll("#workout-table tbody tr");
  const esercizi = [];

  righe.forEach(riga => {
    const gruppo = riga.cells[0].querySelector("input").value.trim();
    const esercizio = riga.cells[1].querySelector("input").value.trim();
    const serie = parseInt(riga.cells[2].querySelector("input").value);
    const ripetizioni = parseInt(riga.cells[3].querySelector("input").value);

    //check dati validi
    if (gruppo && esercizio && !isNaN(serie) && !isNaN(ripetizioni)) {
      esercizi.push({ gruppo, esercizio, serie, ripetizioni });
    }
  });

  if (esercizi.length === 0) {
    alert("Aggiungi almeno un esercizio valido.");
    return;
  }

  fetch("/api/schede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: nomeScheda,
      esercizi: esercizi
    })
  })
    .then(async res => {
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.error || "Errore generico");
        } else {
          const text = await res.text();
          console.error("Risposta non JSON:", text);
          throw new Error("Errore imprevisto dal server");
        }
      }

      alert("Scheda salvata con successo!");

      //resetta campi
      document.getElementById("nome-scheda").value = "";
      const tbody = document.querySelector("#workout-table tbody");
      tbody.innerHTML = '';

      aggiungiRiga();
    })
    .catch(err => {
      console.error("Errore:", err);
      alert("Errore durante il salvataggio: " + err.message);
    });
});
