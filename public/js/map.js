// Inizializza la mappa centrata su una città (es. Roma)
const map = L.map('map').setView([41.9028, 12.4964], 12);

// Aggiunge la mappa di base da OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Aggiungi marker di esempio
const palestre = [
    {
        nome: "Palestra Roma Center",
        lat: 41.9022,
        lng: 12.5000,
        indirizzo: "Via Esempio 123, Roma"
    },
    {
        nome: "FitZone Trastevere",
        lat: 41.8882,
        lng: 12.4700,
        indirizzo: "Viale Trastevere 55, Roma"
    }
];

palestre.forEach(palestra => {
    L.marker([palestra.lat, palestra.lng])
        .addTo(map)
        .bindPopup(`<b>${palestra.nome}</b><br>${palestra.indirizzo}`);
});
