//calcolatore tdee
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    
    calculateBtn.addEventListener('click', function() {
        // estrai valori da form
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);
  
        // check input
        if (isNaN(age)) {
            alert("Inserisci un'età valida");
            return;
        }
        
        if (isNaN(weight)) {
            alert("Inserisci un peso valido");
            return;
        }
        
        if (isNaN(height)) {
            alert("Inserisci un'altezza valida");
            return;
        }
  
        
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
  

        const tdee = Math.round(bmr * activity);
        
        const maintenance = tdee;
        const weightLoss = tdee - 500;
        const weightGain = tdee + 500;
        
        // mostra risultato
        document.getElementById('result').innerHTML = `
            <p>Il tuo TDEE stimato è di <strong>${tdee} kcal</strong> al giorno.</p>
            <div class="tdee-recommendations">
                <h3>Consigli calorici:</h3>
                <ul>
                    <li>Mantenimento peso: ${maintenance} kcal/giorno</li>
                    <li>Perdita peso (0.5kg/settimana): ${weightLoss} kcal/giorno</li>
                    <li>Aumento peso (0.5kg/settimana): ${weightGain} kcal/giorno</li>
                </ul>
            </div>
        `;

        //rendi visibile result
        document.getElementById('result').style.display = 'block';
    });
  });