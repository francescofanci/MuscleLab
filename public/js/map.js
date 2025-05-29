document.addEventListener('DOMContentLoaded', function () {

    //centra su roma
    const map = L.map('map').setView([41.9028, 12.4964], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //array per marker visibili
    let markers = [];

    //aggiornare visibilità marker in base allo zoom attuale
    function updateMarkersVisibility() {
        const zoomLevel = map.getZoom();

        markers.forEach(({ marker }) => {
            if (zoomLevel >= 13) {
                if (!map.hasLayer(marker)) {
                    marker.addTo(map);
                }
            } else {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            }
        });
    }

    //rimuovi i marker dalla mappa
    function clearMarkers() {
        markers.forEach(({ marker }) => map.removeLayer(marker));
        markers = [];
    }

    //aggiungi marker sulla mappa
    function addMarkers(palestre) {
        clearMarkers();

        palestre.forEach(palestra => {
            //crea marker con info
            const marker = L.marker([palestra.latitudine, palestra.longitudine])
                .bindPopup(`
                    <h4><strong>${palestra.nome}</strong></h4>
                    <p>${palestra.indirizzo}</p>
                    <p><b>Tipo:</b> ${palestra.tipo}</p>
                    <p><b>Servizi:</b> ${palestra.servizi}</p>
                    <p><b>Orari:</b> ${palestra.orari}</p>
                    <p><b>Prezzo:</b> ${palestra.prezzo}</p>
                `);

            //aggiungi marker all’array
            markers.push({
                marker,
                latitudine: palestra.latitudine,
                longitudine: palestra.longitudine
            });
        });

        updateMarkersVisibility();
    }

    //carica tutte le palestre
    fetch('/api/filtra-palestre', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) //nessun filtro
    })
        .then(response => response.json())
        .then(addMarkers)
        .catch(error => console.error('Errore nel caricamento iniziale:', error));


    document.getElementById('cerca').addEventListener('click', function () {

        const tipi = Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(el => el.value);
        const prezzo = document.getElementById('prezzo').value;
        const servizi = Array.from(document.querySelectorAll('input[name="servizi"]:checked')).map(el => el.value);
        const orari = Array.from(document.querySelectorAll('input[name="orari"]:checked')).map(el => el.value);

        //invia dati filtri al server
        fetch('/api/filtra-palestre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipi: tipi,
                prezzo: prezzo,
                servizi: servizi,
                orari: orari
            })
        })
            .then(response => response.json())
            .then(addMarkers)
            .catch(error => console.error('Errore durante il filtraggio:', error));
    });

    map.on('zoomend', updateMarkersVisibility);

    updateMarkersVisibility();
});
