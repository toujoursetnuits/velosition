// Signale au CSS que le JavaScript fonctionne (pour les animations d'apparition)
document.documentElement.classList.add("js");

const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== 1. APPARITION DES BLOCS AU DÉFILEMENT ===== */
const observateur = new IntersectionObserver((entrees) => {
  entrees.forEach((entree) => {
    if (entree.isIntersecting) {
      entree.target.classList.add("visible");
      observateur.unobserve(entree.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".apparition").forEach((bloc) => observateur.observe(bloc));

/* ===== 2. CARROUSEL ===== */
const carrousel = document.querySelector(".carrousel");
const diapos = document.querySelectorAll(".diapo");
let diapoActuelle = 0;
let enPause = false;

function afficherDiapo(numero) {
  diapos[diapoActuelle].classList.remove("active");
  diapoActuelle = (numero + diapos.length) % diapos.length; // revient au début après la dernière
  diapos[diapoActuelle].classList.add("active");
}

document.querySelector(".fleche-gauche").addEventListener("click", () => afficherDiapo(diapoActuelle - 1));
document.querySelector(".fleche-droite").addEventListener("click", () => afficherDiapo(diapoActuelle + 1));

// Défilement automatique toutes les 4 secondes, en pause quand la souris est dessus
if (!mouvementReduit) {
  setInterval(() => {
    if (!enPause) afficherDiapo(diapoActuelle + 1);
  }, 4000);
  carrousel.addEventListener("mouseenter", () => (enPause = true));
  carrousel.addEventListener("mouseleave", () => (enPause = false));
  carrousel.addEventListener("focusin", () => (enPause = true));
  carrousel.addEventListener("focusout", () => (enPause = false));
}

/* ===== 3. FENÊTRE « EN SAVOIR PLUS » DES ÉVÉNEMENTS ===== */
const modaleEvenement = document.getElementById("modale-evenement");

document.querySelectorAll(".carte").forEach((carte) => {
  carte.querySelector(".lien-details").addEventListener("click", () => {
    // On recopie le contenu de la carte dans la fenêtre
    document.getElementById("modale-photo").src = carte.querySelector("img").src;
    document.getElementById("modale-titre").textContent = carte.querySelector("h3").textContent;
    document.getElementById("modale-date").textContent = carte.querySelector(".carte-date").textContent;
    document.getElementById("modale-texte").innerHTML = carte.querySelector(".details").innerHTML;
    modaleEvenement.showModal();
  });
});

/* ===== 4. FENÊTRE DE RÉSERVATION ===== */
document.getElementById("bouton-reserver").addEventListener("click", () => {
  document.getElementById("modale-reservation").showModal();
});

// Fermeture des fenêtres : bouton ×, clic sur le fond sombre (Échap marche tout seul)
document.querySelectorAll("dialog").forEach((modale) => {
  modale.querySelector(".fermer").addEventListener("click", () => modale.close());
  modale.addEventListener("click", (e) => {
    if (e.target === modale) modale.close();
  });
});

/* ===== 5. COMPTE À REBOURS (modifie la date ici) ===== */
const DATE_VERNISSAGE = new Date("2026-11-09T18:00:00+01:00");

function deuxChiffres(n) {
  return String(n).padStart(2, "0"); // 5 devient "05"
}

function majCompteur() {
  const reste = DATE_VERNISSAGE - Date.now();

  if (reste <= 0) {
    document.getElementById("compteur").hidden = true;
    document.getElementById("message-fin").hidden = false;
    clearInterval(minuteur);
    return;
  }

  const secondesTotales = Math.floor(reste / 1000);
  document.getElementById("jours").textContent = deuxChiffres(Math.floor(secondesTotales / 86400));
  document.getElementById("heures").textContent = deuxChiffres(Math.floor((secondesTotales % 86400) / 3600));
  document.getElementById("minutes").textContent = deuxChiffres(Math.floor((secondesTotales % 3600) / 60));
  document.getElementById("secondes").textContent = deuxChiffres(secondesTotales % 60);
}

const minuteur = setInterval(majCompteur, 1000);
majCompteur();
