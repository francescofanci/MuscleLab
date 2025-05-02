// getsione bottone
const frontSvg = document.getElementById('front');
const backSvg = document.getElementById('back');
const button = document.getElementById('toggleSvg');

let isFront = true;

button.addEventListener('click', () => {
    if (isFront) {
        frontSvg.style.display = 'none';
        backSvg.style.display = 'block';
        button.textContent = 'Front';
    } else {
        frontSvg.style.display = 'block';
        backSvg.style.display = 'none';
        button.textContent = 'Back';
    }
    isFront = !isFront;
});

// gestione sagoma
document.addEventListener("DOMContentLoaded", () => {
    const excludedId = "sagoma";
  
    document.querySelectorAll("svg path").forEach(path => {
      const id = path.id;
  
      if (id === excludedId) return;
      
      // trova il muscolo gemello
      const originalColor = path.getAttribute("fill") || "rgb(216, 216, 216)";
      let counterpartId = null;
      if (id.endsWith("SX")) {
        counterpartId = id.replace("SX", "DX");
      } else if (id.endsWith("DX")) {
        counterpartId = id.replace("DX", "SX");
      }
  
      const resetStyle = (el) => {
        el.style.fill = originalColor;
        el.style.opacity = "1";
      };
  
      path.addEventListener("mouseenter", () => {
        path.style.fill = "#ff6666";
        path.style.opacity = "1";
        path.style.cursor = "pointer";
        if (counterpartId) {
          const counterpart = document.getElementById(counterpartId);
          if (counterpart) {
            counterpart.style.fill = "#ff6666";
            counterpart.style.opacity = "1";
          }
        }
      });
  
      path.addEventListener("mouseleave", () => {
        resetStyle(path);
        if (counterpartId) {
          const counterpart = document.getElementById(counterpartId);
          if (counterpart) {
            resetStyle(counterpart);
          }
        }
      });
  
      path.addEventListener("click", () => {
        
        let musclePageUrl = '';
  
        if (id.includes("chest")) {
          musclePageUrl = "gruppi/chest.html";
        } else if (id.includes("bicep")) {
          musclePageUrl = "gruppi/bicep.html";
        } else if (id.includes("quad")) {
          musclePageUrl = "gruppi/quad.html";
        } else if (id.includes("abs")){
            musclePageUrl = "gruppi/abs.html"
        } else if (id.includes("shoulder")){
            musclePageUrl = "gruppi/shoulder.html"
        } else if (id.includes("tricep")){
            musclePageUrl = "gruppi/tricep.html"
        } else if (id.includes("lat")){
            musclePageUrl = "gruppi/lat.html"
        } else if (id.includes("fem")){
            musclePageUrl = "gruppi/fem.html"
        }
        else {
          musclePageUrl = "diz.html";
        }
  
        window.location.href = musclePageUrl;
      });
    });
  });
  
//bottone info
document.getElementById("infoButton").addEventListener("click", function () {
    document.getElementById("infoPopup").classList.remove("hidden");
});

document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("infoPopup").classList.add("hidden");
});
