// tgd-reviews.js — Widget avis Google en live
// Affiche en priorité les avis renvoyés par /api/reviews, triés du plus récent au plus ancien.

(function () {
  'use strict';

  const FALLBACK = [
    { author: 'Florent Vial', rating: 5, text: "Yvan a été d'un grand professionnalisme lors de la livraison de mon véhicule ! Très agréable, disponible et soucieux de m'expliquer les choses en prenant le temps !", publishedAt: '2026-05-19T00:00:00Z' },
    { author: 'Cédric Niçoise', rating: 5, text: "Livraison du véhicule parfaite : une entreprise sérieuse, ponctuelle et d'un professionnalisme irréprochable.", publishedAt: '2026-04-15T00:00:00Z' },
    { author: 'Frédéric Bazin', rating: 5, text: "C'est le deuxième véhicule BMW que Jonathan me livre. Merci à lui pour ces précieux conseils. Le service est à la hauteur de la marque.", publishedAt: '2026-03-23T00:00:00Z' },
    { author: 'Isabelle NDOYE Maddio', rating: 5, text: 'Avis client Google vérifié.', publishedAt: '2026-03-18T00:00:00Z' },
    { author: 'Jonathan Gaignon', rating: 5, text: 'Avis client Google vérifié.', publishedAt: '2026-02-18T00:00:00Z' }
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function stars(n) {
    const safe = Math.max(0, Math.min(5, Number(n) || 0));
    return '★'.repeat(safe) + '☆'.repeat(5 - safe);
  }

  function timestamp(review) {
    const raw = review && (review.publishedAt || review.updateTime || review.createTime || review.date);
    const value = raw ? Date.parse(raw) : NaN;
    return Number.isFinite(value) ? value : 0;
  }

  function formatDate(review) {
    const ts = timestamp(review);
    if (!ts) return 'Avis Google';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(ts));
  }

  function normalise(review) {
    return {
      author: review.author || review.authorName || review.reviewer || 'Client Google',
      rating: Number(review.rating) || 5,
      text: review.text || review.comment || review.reviewText || '',
      publishedAt: review.publishedAt || review.updateTime || review.createTime || review.date || null
    };
  }

  function buildCard(review) {
    const r = normalise(review);
    const quote = r.text ? `<p class="testi-quote">« ${escapeHtml(r.text)} »</p>` : '';
    return `
      <div class="testi">
        <div class="testi-stars" aria-label="${r.rating} étoiles sur 5">${stars(r.rating)}</div>
        ${quote}
        <div class="testi-author">${escapeHtml(r.author)}</div>
        <div class="testi-role">${escapeHtml(formatDate(r))} · Google</div>
      </div>`;
  }

  function render(widgets, reviews, rating, total) {
    const ordered = (reviews || []).map(normalise).sort((a, b) => timestamp(b) - timestamp(a));

    widgets.forEach(widget => {
      const max = Math.max(1, parseInt(widget.dataset.max || '3', 10));
      widget.innerHTML = ordered.slice(0, max).map(buildCard).join('');
    });

    const safeRating = Number(rating) || 5;
    const safeTotal = Number(total) || 38;

    document.querySelectorAll('.tgd-rating-score').forEach(el => {
      el.textContent = safeRating.toFixed(1).replace('.', ',');
    });
    document.querySelectorAll('.tgd-rating-total').forEach(el => {
      el.textContent = `${safeTotal} avis`;
    });
    document.querySelectorAll('.tgd-rating-number').forEach(el => {
      el.textContent = String(safeTotal);
    });
  }

  async function load() {
    const widgets = document.querySelectorAll('.tgd-reviews-widget');
    const dynamicTotals = document.querySelectorAll('.tgd-rating-total, .tgd-rating-number, .tgd-rating-score');
    if (!widgets.length && !dynamicTotals.length) return;

    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      if (!res.ok) throw new Error('API reviews indisponible');
      const data = await res.json();
      const reviews = Array.isArray(data.reviews) && data.reviews.length ? data.reviews : FALLBACK;
      render(widgets, reviews, data.rating, data.total);
    } catch (error) {
      render(widgets, FALLBACK, 5.0, 38);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
