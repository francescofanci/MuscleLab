
  function aggiungiRiga() {
    const tbody = document.querySelector("#workout-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="number" min="1"></td>
      <td><input type="number" min="1"></td>
      <td><input type="number" min="1"></td>
      <td><button onclick="rimuoviRiga(this)">🗑️</button></td>
    `;
    tbody.appendChild(row);
  }

  function rimuoviRiga(button) {
    button.closest("tr").remove();
  }
