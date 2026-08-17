(function () {
  'use strict';

  function track(name, properties) {
    var safe = properties || {};
    if (typeof window.va === 'function') window.va('event', { name: name, data: safe });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, safe));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var label = (link.textContent || '').trim().slice(0, 80);

    if (href.indexOf('tel:') === 0) track('contact_phone', { page: location.pathname, label: label });
    if (href.indexOf('https://wa.me/') === 0) track('contact_whatsapp', { page: location.pathname, label: label });
    if (link.matches('[data-audience]')) track('audience_choice', { page: location.pathname, audience: link.getAttribute('data-audience') });
    if (link.matches('[data-cta="quote"]')) track('quote_cta', { page: location.pathname, label: label });
  });

  document.addEventListener('tgd:form-success', function (event) {
    track('lead_form_success', {
      page: location.pathname,
      form: event.detail && event.detail.formId ? event.detail.formId : 'unknown'
    });
  });

  function replaceVisibleText(root, from, to) {
    if (!root || !from || from === to) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue && node.nodeValue.indexOf(from) !== -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    var current;
    while ((current = walker.nextNode())) nodes.push(current);
    nodes.forEach(function (node) { node.nodeValue = node.nodeValue.split(from).join(to); });
  }

  function injectSeoHub(path) {
    if (path !== '/' && path !== '/convoyage') return;
    if (document.getElementById('tgd-seo-link-hub')) return;

    var footer = document.querySelector('footer.footer-mini, footer');
    if (!footer) return;

    var style = document.createElement('style');
    style.id = 'tgd-seo-link-hub-style';
    style.textContent = '' +
      '#tgd-seo-link-hub{padding:2.6rem 4vw;background:#111;border-top:1px solid rgba(201,169,110,.08);text-align:center}' +
      '#tgd-seo-link-hub .hub-inner{max-width:1050px;margin:0 auto}' +
      '#tgd-seo-link-hub h2{font-family:"Cormorant Garamond",serif;font-size:clamp(1.45rem,2.5vw,2rem);font-weight:300;color:#F5F0E8;margin:0 0 .55rem}' +
      '#tgd-seo-link-hub p{font-size:.76rem;color:#BDB5A6;margin:0 auto 1.25rem;max-width:720px;line-height:1.75}' +
      '#tgd-seo-link-hub .hub-links{display:flex;flex-wrap:wrap;justify-content:center;gap:.55rem}' +
      '#tgd-seo-link-hub .hub-links a{display:inline-block;padding:.48rem .72rem;border:1px solid rgba(201,169,110,.16);color:#D8D0C2;text-decoration:none;font-size:.72rem;line-height:1.2;transition:border-color .2s,color .2s,background .2s}' +
      '#tgd-seo-link-hub .hub-links a:hover{border-color:#C9A96E;color:#C9A96E;background:rgba(201,169,110,.04)}' +
      '@media(max-width:600px){#tgd-seo-link-hub{padding:2.2rem 5vw}#tgd-seo-link-hub .hub-links{gap:.45rem}#tgd-seo-link-hub .hub-links a{font-size:.7rem;padding:.5rem .62rem}}';
    document.head.appendChild(style);

    var section = document.createElement('section');
    section.id = 'tgd-seo-link-hub';
    section.setAttribute('aria-label', 'Nos services et zones de convoyage');
    section.innerHTML = '<div class="hub-inner">' +
      '<h2>Convoyage automobile en France et en Europe</h2>' +
      '<p>Accédez directement à nos expertises et aux principales zones dans lesquelles nous organisons régulièrement des missions.</p>' +
      '<div class="hub-links">' +
      '<a href="/convoyage-paris">Paris</a>' +
      '<a href="/convoyage-lyon">Lyon</a>' +
      '<a href="/convoyage-marseille">Marseille</a>' +
      '<a href="/convoyage-bordeaux">Bordeaux</a>' +
      '<a href="/convoyage-lille">Lille</a>' +
      '<a href="/convoyage-nantes">Nantes</a>' +
      '<a href="/convoyage-toulouse">Toulouse</a>' +
      '<a href="/convoyage-nice">Nice</a>' +
      '<a href="/convoyage-strasbourg">Strasbourg</a>' +
      '<a href="/convoyage-montpellier">Montpellier</a>' +
      '<a href="/convoyage-concession">Concessions</a>' +
      '<a href="/convoyage-electrique">Véhicules électriques</a>' +
      '<a href="/convoyage-luxe">Prestige & collection</a>' +
      '<a href="/chauffeur-longue-distance">Chauffeur longue distance</a>' +
      '<a href="/transport-plateau">Transport sur plateau</a>' +
      '</div></div>';
    footer.parentNode.insertBefore(section, footer);
  }

  function finalSitePolish(path) {
    /* Consolidation premium -> luxe dans tous les liens rendus, en plus de la redirection serveur. */
    document.querySelectorAll('a[href="/convoyage-premium"], a[href="/convoyage-premium/"]').forEach(function (link) {
      link.setAttribute('href', '/convoyage-luxe');
      if ((link.textContent || '').trim().toLowerCase() === 'premium') link.textContent = 'Prestige';
    });

    /* La promesse commerciale reste forte sans formulation absolue difficile à garantir. */
    if (path === '/contact') {
      replaceVisibleText(document.body, 'Réponse garantie sous 2h', 'Réponse habituelle sous 2h');
    }

    /* Cohérence assurance sur la page convoyage : pas de promesse générique de plaques W ou de couverture automatique. */
    if (path === '/convoyage') {
      replaceVisibleText(document.body, 'Conduite sous plaques W professionnelles', 'Conduite selon les conditions d’assurance et d’immatriculation validées avant la mission');
      replaceVisibleText(document.body, 'L’assurance est activée, le parcours planifié.', 'La couverture et les conditions de conduite sont vérifiées, le parcours est planifié.');
      replaceVisibleText(document.body, 'assuré par notre contrat professionnel et autorisé à circuler', 'autorisé à circuler et couvert pour le trajet prévu');
      document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
        script.textContent = script.textContent.replace('Plaques W, couverture automobile vérifiée', 'Couverture automobile vérifiée');
      });
    }

    injectSeoHub(path);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var requestedService = new URLSearchParams(location.search).get('service');
    if (requestedService) {
      var serviceSelect = document.querySelector('select[name="type_mission_1"], select[name="vous_etes"]');
      if (serviceSelect) {
        var needle = requestedService.replace(/-/g, ' ').toLowerCase();
        Array.prototype.some.call(serviceSelect.options, function (option) {
          if ((option.textContent || '').toLowerCase().indexOf(needle) !== -1) {
            serviceSelect.value = option.value;
            return true;
          }
          return false;
        });
      }
    }

    var path = location.pathname.replace(/\/+$/, '') || '/';
    finalSitePolish(path);

    /* Aucun bandeau de conversion sur la page devis/contact : le formulaire est déjà l'action principale. */
    if (path === '/contact') {
      var existingMobileDock = document.querySelector('.sticky-mobile, .conversion-mobile');
      if (existingMobileDock) existingMobileDock.remove();
      return;
    }

    /* L'accueil possède déjà ses CTA et son devis express dans le contenu. */
    if (document.body.classList.contains('site-home')) return;

    var form = document.querySelector('.tgd-form');
    var quoteHref = '/contact?service=' + encodeURIComponent(path.replace(/^\//, '') || 'accueil');
    var formSection = null;
    if (form) {
      formSection = form.closest('section') || form.parentElement;
      formSection.id = formSection.id || 'devis-express';
      quoteHref = '#' + formSection.id;
    }

    var dock = document.createElement('aside');
    dock.className = 'conversion-dock';
    dock.setAttribute('aria-label', 'Contact rapide');
    dock.setAttribute('aria-hidden', 'true');
    dock.innerHTML = '<span><strong>Un trajet &#224; organiser&nbsp;?</strong><small>R&#233;ponse directe, sans call center</small></span>' +
      '<a href="tel:+33761092626" class="conversion-dock-phone">07 61 09 26 26</a>' +
      '<a href="' + quoteHref + '" class="conversion-dock-quote" data-cta="quote">Devis express</a>';
    document.body.appendChild(dock);

    var dockBlocked = false;
    var scrollThreshold = Math.max(360, Math.round(window.innerHeight * 0.55));

    function updateDockVisibility() {
      var shouldShow = window.scrollY > scrollThreshold && !dockBlocked;
      dock.classList.toggle('is-visible', shouldShow);
      dock.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    }

    window.addEventListener('scroll', updateDockVisibility, { passive: true });
    window.addEventListener('resize', function () {
      scrollThreshold = Math.max(360, Math.round(window.innerHeight * 0.55));
      updateDockVisibility();
    });

    /* Ne jamais recouvrir la zone de devis ou un gros bloc d'appel à l'action. */
    var blockers = [];
    if (formSection) blockers.push(formSection);
    document.querySelectorAll('.cta-section, .contact-section, #contact, #devis-express').forEach(function (el) {
      if (blockers.indexOf(el) === -1) blockers.push(el);
    });

    if ('IntersectionObserver' in window && blockers.length) {
      var observer = new IntersectionObserver(function (entries) {
        dockBlocked = entries.some(function (entry) { return entry.isIntersecting; });
        updateDockVisibility();
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      blockers.forEach(function (el) { observer.observe(el); });
    }

    updateDockVisibility();

    if (!document.querySelector('.sticky-mobile')) {
      var mobileDock = document.createElement('nav');
      mobileDock.className = 'conversion-mobile';
      mobileDock.setAttribute('aria-label', 'Contact rapide');
      mobileDock.innerHTML = '<a href="tel:+33761092626" class="conversion-mobile-call">Appeler</a>' +
        '<a href="https://wa.me/33761092626" class="conversion-mobile-whatsapp">WhatsApp</a>' +
        '<a href="' + quoteHref + '" class="conversion-mobile-quote" data-cta="quote">Devis</a>';
      document.body.appendChild(mobileDock);
    }
  });
})();
