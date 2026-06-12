// tgd-reviews.js — Widget avis Google en live
// À inclure sur toutes les pages avec : <script src="tgd-reviews.js"></script>
// Remplace automatiquement le contenu des éléments .tgd-reviews-widget

(function () {
  const FALLBACK = [
    { author: 'Clément Le Chatelier', rating: 5, text: "Pour livraison véhicule de société. Ponctuel, prend le temps de tout expliquer et très sympa !", time: 'il y a 7 jours' },
    { author: 'Florent Vial', rating: 5, text: "Yvan a été d'un grand professionnalisme lors de la livraison de mon véhicule ! Très agréable, disponible et soucieux de m'expliquer les choses en prenant le temps !", time: 'il y a 3 semaines' },
    { author: 'Frédéric Bazin', rating: 5, text: "C'est le deuxième véhicule BMW que Jonathan me livre. Merci à lui pour ces précieux conseils. Le service est à la hauteur de la marque.", time: 'il y a 11 semaines' },
    { author: 'Cédric Niçoise', rating: 5, text: "Livraison du véhicule parfaite : une entreprise sérieuse, ponctuelle et d'un professionnalisme irréprochable.", time: 'il y a 8 semaines' },
    { author: 'Aurore Laitu', rating: 5, text: "Personnel très professionnel et pédagogue ! Surtout pour une 1ère voiture électrique. Un service de qualité.", time: 'il y a 10 semaines' },
    { author: 'Katia Pariente', rating: 5, text: "Service de convoyage automobile impeccable entre Paris et Marseille. Prise en charge simple, échanges fluides.", time: 'il y a 17 semaines' },
  ];

  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function buildCard(r) {
    return `
      <div class="testi">
        <div class="testi-stars">${stars(r.rating)}</div>
        <p class="testi-quote">« ${r.text} »</p>
        <div class="testi-author">${r.author}</div>
        <div class="testi-role">${r.time} · Google</div>
      </div>`;
  }

  function render(widgets, reviews, rating, total) {
    widgets.forEach(widget => {
      const max = parseInt(widget.dataset.max || '3');
      const selected = reviews.slice(0, max);
      widget.innerHTML = selected.map(buildCard).join('');
    });

    // Update score displays
    document.querySelectorAll('.tgd-rating-score').forEach(el => {
      el.textContent = rating ? rating.toFixed(1) : '5,0';
    });
    document.querySelectorAll('.tgd-rating-total').forEach(el => {
      el.textContent = total ? `${total} avis` : '28 avis';
    });
  }

  async function load() {
    const widgets = document.querySelectorAll('.tgd-reviews-widget');
    if (!widgets.length) return;

    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.reviews && data.reviews.length) {
        render(widgets, data.reviews, data.rating, data.total);
      } else {
        render(widgets, FALLBACK, 5.0, 28);
      }
    } catch {
      // Fallback silencieux si l'API ne répond pas
      render(widgets, FALLBACK, 5.0, 28);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
