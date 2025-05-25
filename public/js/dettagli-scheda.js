window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const schedaId = urlParams.get('id'); //recupera id scheda

  if (!schedaId) {
    alert("ID della scheda mancante.");
    return;
  }

  fetch(`/api/scheda/${schedaId}`)
    .then(res => {
      if (!res.ok) throw new Error("Scheda non trovata");
      return res.json();
    })
    .then(scheda => {
      const table = document.getElementById("scheda-detail");
      //crea h2 e inserisci nome scheda
      const container = document.querySelector(".scheda-table-container");
      const title = document.createElement("h2");
      title.textContent = scheda.nome;
      container.insertBefore(title, table);

      
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";
      //aggiungi righe con i dettagli scheda
      scheda.esercizi.forEach(e => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${e.esercizio} <br><small>(${e.gruppo})</small></td>
          <td>${e.serie}</td>
          <td>${e.ripetizioni}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Errore nel recupero della scheda:", err);
      alert("Errore nel recupero dei dettagli della scheda.");
    });
});
