document.addEventListener('DOMContentLoaded', () => {
  const workouts = document.querySelectorAll('.workout');

  //recupera workout salvati dall utente dal server
  fetch('/api/user-info')
    .then(response => {
      if (!response.ok) throw new Error("Non autenticato");
      return response.json();
    })
    .then(data => {
      const salvati = new Set(data.workouts);

      workouts.forEach(workout => {
        const nome = workout.getAttribute('data-title');
        const button = workout.querySelector('.save-btn');
        const icon = button.querySelector('i');

        if (salvati.has(nome)) {
          icon.classList.remove('fa-bookmark');
          icon.classList.add('fa-check');
          button.title = 'Salvato';
        }
      });
    })
    .catch(err => {
      console.error("Errore nel recupero dei workout salvati:", err);
    });

  //apri/chiudi dettagli
  workouts.forEach(workout => {
    workout.addEventListener('click', (e) => {
      if (!e.target.closest('.save-btn')) {
        const details = workout.querySelector('.details');
        details.style.display = details.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  //gestione salva/rimuovi
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();

      const icon = button.querySelector('i');
      const workoutElement = button.closest('.workout');
      const workoutName = workoutElement.getAttribute('data-title');
      const isSaved = icon.classList.contains('fa-check'); //verifica se è gia salvato
      const url = isSaved ? '/api/remove-workout' : '/api/save-workout';

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: workoutName })
      })
      .then(res => {
        if (!res.ok) throw new Error('Errore aggiornamento stato');

        if (isSaved) {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-bookmark');
          button.title = 'Salva';
        } else {
          icon.classList.remove('fa-bookmark');
          icon.classList.add('fa-check');
          button.title = 'Salvato';
        }
      })
      .catch(err => {
        console.error('Errore fetch:', err);
      });
    });
  });
});
