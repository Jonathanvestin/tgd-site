// tgd-reviews.js — Widget avis Google en live + intégration B2B homepage
// Affiche en priorité les avis renvoyés par /api/reviews, triés du plus récent au plus ancien.

(function () {
  'use strict';

  const FALLBACK = [
    { author: 'Théo Launay', rating: 5, text: "Mon véhicule m’a été livré par Jonathan. Très sympathique et professionnel, tout s’est parfaitement déroulé, je recommande à 100% !", publishedAt: '2026-06-30T13:06:46Z' },
    { author: 'Florent Vial', rating: 5, text: "Yvan a été d'un grand professionnalisme lors de la livraison de mon véhicule ! Très agréable, disponible et soucieux de m'expliquer les choses en prenant le temps !", publishedAt: '2026-05-19T20:01:25Z' },
    { author: 'Frédéric Bazin', rating: 5, text: "C'est le deuxième véhicule BMW que Jonathan me livre. Merci à lui pour ces précieux conseils. Le service est à la hauteur de la marque.", publishedAt: '2026-03-23T15:56:18Z' },
    { author: 'Isabelle NDOYE Maddio', rating: 5, text: 'Super moment passé avec Jonathan ! La livraison de mon nouveau véhicule a été impeccable et soignée.', publishedAt: '2026-03-18T16:15:46Z' },
    { author: 'Katia Pariente', rating: 5, text: 'Service de convoyage automobile impeccable entre Paris et Marseille. Prise en charge simple, échanges fluides et respect des délais.', publishedAt: '2026-02-09T18:51:21Z' }
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
    const safeTotal = Number(total) || 40;

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

  function upgradeHomeB2B() {
    if (!document.body.classList.contains('site-home')) return;

    // 1) Navigation desktop : Entreprises -> Solutions Pro
    document.querySelectorAll('.nav-links a[href="/entreprises"]').forEach(link => {
      link.href = '/solutions-professionnelles';
      link.textContent = 'Solutions Pro';
    });

    // 2) Navigation mobile
    document.querySelectorAll('.mobile-menu a[href="/entreprises"]').forEach(link => {
      link.href = '/solutions-professionnelles';
      link.textContent = 'Solutions Pro';
    });

    // 3) Routeur d'audience : la porte professionnelle devient le hub B2B
    const proCard = document.querySelector('.audience-card[data-audience="professionnel"]');
    if (proCard) {
      proCard.href = '/solutions-professionnelles';
      const strong = proCard.querySelector('strong');
      const copy = proCard.querySelector('strong + span');
      if (strong) strong.textContent = 'Je gère des véhicules professionnels';
      if (copy) copy.textContent = 'Flottes, constructeurs, groupes automobiles, concessions et opérations digitales.';
    }

    // 4) Mini-hub B2B visible immédiatement après le routeur, sans alourdir le hero
    const router = document.querySelector('.audience-router');
    if (!router || document.getElementById('tgd-b2b-home-hub')) return;

    const style = document.createElement('style');
    style.textContent = `
      #tgd-b2b-home-hub{padding:2.2rem 4vw!important;background:#0d1014;border-bottom:1px solid rgba(201,169,110,.12)}
      #tgd-b2b-home-hub .b2b-home-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:280px repeat(3,1fr);gap:1px;background:rgba(159,169,179,.14)}
      #tgd-b2b-home-hub .b2b-home-intro,#tgd-b2b-home-hub .b2b-home-card{background:#11151a;padding:1.35rem 1.4rem}
      #tgd-b2b-home-hub .b2b-home-intro{display:flex;flex-direction:column;justify-content:center}
      #tgd-b2b-home-hub .b2b-home-kicker{font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:.45rem}
      #tgd-b2b-home-hub .b2b-home-intro strong{font-family:'Cormorant Garamond',serif;font-size:1.55rem;font-weight:400;color:#f5f0e8;line-height:1.15}
      #tgd-b2b-home-hub .b2b-home-intro span{font-size:.7rem;color:#9fa8b1;margin-top:.45rem;line-height:1.5}
      #tgd-b2b-home-hub .b2b-home-card{text-decoration:none;transition:.2s;position:relative}
      #tgd-b2b-home-hub .b2b-home-card:hover{background:#171c22}
      #tgd-b2b-home-hub .b2b-home-card strong{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;color:#f5f0e8;display:block;margin-bottom:.35rem}
      #tgd-b2b-home-hub .b2b-home-card strong em{font-style:italic;color:#c9a96e}
      #tgd-b2b-home-hub .b2b-home-card span{font-size:.69rem;color:#aeb6bd;line-height:1.5;display:block;padding-right:1.5rem}
      #tgd-b2b-home-hub .b2b-home-card::after{content:'→';position:absolute;right:1rem;top:50%;transform:translateY(-50%);color:#c9a96e}
      @media(max-width:900px){#tgd-b2b-home-hub{padding:1rem 5vw!important}#tgd-b2b-home-hub .b2b-home-inner{grid-template-columns:1fr}#tgd-b2b-home-hub .b2b-home-intro{padding-bottom:1rem}}
    `;
    document.head.appendChild(style);

    const hub = document.createElement('section');
    hub.id = 'tgd-b2b-home-hub';
    hub.setAttribute('aria-label', 'Solutions professionnelles TGD');
    hub.innerHTML = `
      <div class="b2b-home-inner">
        <div class="b2b-home-intro">
          <div class="b2b-home-kicker">Solutions professionnelles</div>
          <strong>Un opérateur.<br>Trois expertises.</strong>
          <span>De l'exécution terrain à la traçabilité digitale.</span>
        </div>
        <a class="b2b-home-card" href="/tgd-fleet"><strong>TGD <em>Fleet</em></strong><span>Mouvements de parc, collaborateurs, restitutions LLD et transferts inter-sites.</span></a>
        <a class="b2b-home-card" href="/tgd-automotive"><strong>TGD <em>Automotive</em></strong><span>Constructeurs, importateurs, groupes automobiles, livraison client et mise en main.</span></a>
        <a class="b2b-home-card" href="/tgd-digital"><strong>TGD <em>Digital</em></strong><span>EDL, photos, kilométrage, énergie, signatures, rapports et historique.</span></a>
      </div>`;
    router.insertAdjacentElement('afterend', hub);
  }

  async function load() {
    upgradeHomeB2B();

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
      render(widgets, FALLBACK, 5.0, 40);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
