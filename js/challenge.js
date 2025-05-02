document.addEventListener('DOMContentLoaded', () => {
    const workouts = document.querySelectorAll('.workout');
  
    workouts.forEach(workout => {
      // apertura/chiusura dettagli workout
      workout.addEventListener('click', (e) => {
        if (!e.target.closest('.save-btn')) {
          const details = workout.querySelector('.details');
          details.style.display = details.style.display === 'block' ? 'none' : 'block';
        }
      });
    });
  
    // gestione icona salva
    document.querySelectorAll('.save-btn').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation(); // non aprire dettagli
        const icon = button.querySelector('i');
        const isSaved = icon.classList.contains('fa-check');
  
        if (isSaved) {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-bookmark');
          button.title = 'Salva';
        } else {
          icon.classList.remove('fa-bookmark');
          icon.classList.add('fa-check');
          button.title = 'Salvato';
        }
      });
    });
  });
  