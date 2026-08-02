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
    if (document.body.classList.contains('site-home')) return;
    var form = document.querySelector('.tgd-form');
    var quoteHref = '/contact?service=' + encodeURIComponent(location.pathname.replace(/^\//, '') || 'accueil');
    if (form) {
      var section = form.closest('section') || form.parentElement;
      section.id = section.id || 'devis-express';
      quoteHref = '#' + section.id;
    }

    var dock = document.createElement('aside');
    dock.className = 'conversion-dock';
    dock.setAttribute('aria-label', 'Contact rapide');
    dock.innerHTML = '<span><strong>Un trajet &#224; organiser&nbsp;?</strong><small>R&#233;ponse directe, sans call center</small></span>' +
      '<a href="tel:+33761092626" class="conversion-dock-phone">07 61 09 26 26</a>' +
      '<a href="' + quoteHref + '" class="conversion-dock-quote" data-cta="quote">Devis express</a>';
    document.body.appendChild(dock);

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
