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

    /* Pas de dock sur l'accueil (ses CTA sont deja visibles) ni sur la page devis/contact. */
    if (document.body.classList.contains('site-home') || path === '/contact') return;

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

    /* Ne jamais recouvrir la zone de devis ou un gros bloc d'appel a l'action. */
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
