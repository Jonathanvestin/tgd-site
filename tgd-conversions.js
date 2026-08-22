(function () {
  'use strict';

  function track(name, properties) {
    var safe = properties || {};
    if (typeof window.va === 'function') window.va('event', { name: name, data: safe });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, safe));
  }

  function installUnifiedNav() {
    var links = document.querySelector('.nav-links');
    if (links) {
      links.innerHTML = '<li><a href="/convoyage">Convoyage</a></li>' +
        '<li class="nav-dropdown"><a href="/solutions-professionnelles" class="nav-dropdown-toggle">Solutions Pro</a><ul class="nav-dropdown-menu"><li><a href="/solutions-professionnelles">Vue d\'ensemble</a></li><li><a href="/tgd-fleet">TGD Fleet</a></li><li><a href="/tgd-automotive">TGD Automotive</a></li><li><a href="/tgd-digital">TGD Digital</a></li><li><a href="/convoyage-concession">Concessions</a></li></ul></li>' +
        '<li><a href="/chauffeur">Chauffeur</a></li><li><a href="/particuliers">Particuliers</a></li><li><a href="/a-propos">À propos</a></li>';
    }
    var navCta = document.querySelector('nav .nav-cta');
    if (navCta) { navCta.href = '/contact'; navCta.textContent = 'Confier une mission'; }

    var mm = document.querySelector('.mobile-menu');
    if (mm) {
      var close = mm.querySelector('.mobile-close');
      var closeHtml = close ? close.outerHTML : '<button type="button" class="mobile-close" aria-label="Fermer le menu">✕</button>';
      mm.innerHTML = closeHtml + '<a href="/convoyage">Convoyage</a><a href="/solutions-professionnelles">Solutions Pro</a><div class="tgd-mobile-sub"><a href="/tgd-fleet">Fleet</a><a href="/tgd-automotive">Automotive</a><a href="/tgd-digital">Digital</a></div><a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a><a href="/a-propos">À propos</a><a href="/contact" class="btn-primary">Confier une mission</a>';
      var cb = mm.querySelector('.mobile-close');
      if (cb) cb.onclick = function(){ mm.classList.remove('open'); };
      mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.classList.remove('open'); }); });
    }

    document.querySelectorAll('.footer-links a[href="/entreprises"], .footer-mini a[href="/entreprises"]').forEach(function(a){ a.href='/solutions-professionnelles'; a.textContent='Solutions Pro'; });
    document.querySelectorAll('a[href="/convoyage-premium"]').forEach(function(a){ a.href='/convoyage-luxe'; });

    var selects = document.querySelectorAll('select[name="type_mission_1"]');
    selects.forEach(function(select){ Array.prototype.forEach.call(select.options, function(option){ if ((option.textContent || '').trim() === 'Solutions entreprises') option.textContent = 'Solutions professionnelles / Fleet'; }); });

    if (!document.getElementById('tgd-unified-nav-style')) {
      var st=document.createElement('style'); st.id='tgd-unified-nav-style'; st.textContent='\
      .nav-links{align-items:center}.nav-dropdown{position:relative}.nav-dropdown-menu{display:none;position:absolute;top:100%;left:-1rem;min-width:225px;padding:.55rem;background:rgba(10,10,10,.99);border:1px solid rgba(201,169,110,.16);box-shadow:0 18px 45px rgba(0,0,0,.28);z-index:220}.nav-dropdown:hover .nav-dropdown-menu{display:block}.nav-dropdown-menu li{list-style:none}.nav-dropdown-menu a{display:block!important;padding:.68rem .75rem!important;font-size:.7rem!important;text-transform:none!important;letter-spacing:.035em!important}.tgd-mobile-sub{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin:-.65rem 0 .1rem}.tgd-mobile-sub a{font-family:Montserrat,sans-serif!important;font-size:.68rem!important;text-transform:uppercase;letter-spacing:.1em;color:#c9a96e!important}@media(max-width:900px){.mobile-menu{justify-content:flex-start!important;padding-top:6.1rem!important;gap:1.1rem!important;overflow-y:auto}.mobile-menu>a:not(.btn-primary){font-size:1.38rem!important}.mobile-menu>.btn-primary{margin-top:.2rem!important}}'; document.head.appendChild(st);
    }
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
    track('lead_form_success', { page: location.pathname, form: event.detail && event.detail.formId ? event.detail.formId : 'unknown' });
  });

  document.addEventListener('DOMContentLoaded', function () {
    installUnifiedNav();

    var requestedService = new URLSearchParams(location.search).get('service');
    if (requestedService) {
      var serviceSelect = document.querySelector('select[name="type_mission_1"], select[name="vous_etes"]');
      if (serviceSelect) {
        var needle = requestedService.replace(/-/g, ' ').toLowerCase();
        Array.prototype.some.call(serviceSelect.options, function (option) {
          if ((option.textContent || '').toLowerCase().indexOf(needle) !== -1) { serviceSelect.value = option.value; return true; }
          return false;
        });
      }
    }

    var path = location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/contact') {
      var existingMobileDock = document.querySelector('.sticky-mobile, .conversion-mobile');
      if (existingMobileDock) existingMobileDock.remove();
      return;
    }
    if (document.body.classList.contains('site-home')) return;

    var form = document.querySelector('.tgd-form');
    var quoteHref = '/contact?service=' + encodeURIComponent(path.replace(/^\//, '') || 'accueil');
    var formSection = null;
    if (form) { formSection = form.closest('section') || form.parentElement; formSection.id = formSection.id || 'devis-express'; quoteHref = '#' + formSection.id; }

    var dock = document.createElement('aside');
    dock.className = 'conversion-dock'; dock.setAttribute('aria-label', 'Contact rapide'); dock.setAttribute('aria-hidden', 'true');
    dock.innerHTML = '<span><strong>Une mission à organiser&nbsp;?</strong><small>Réponse directe, sans call center</small></span><a href="tel:+33761092626" class="conversion-dock-phone">07 61 09 26 26</a><a href="' + quoteHref + '" class="conversion-dock-quote" data-cta="quote">Confier une mission</a>';
    document.body.appendChild(dock);

    var dockBlocked = false;
    var scrollThreshold = Math.max(360, Math.round(window.innerHeight * 0.55));
    function updateDockVisibility() { var shouldShow = window.scrollY > scrollThreshold && !dockBlocked; dock.classList.toggle('is-visible', shouldShow); dock.setAttribute('aria-hidden', shouldShow ? 'false' : 'true'); }
    window.addEventListener('scroll', updateDockVisibility, { passive: true });
    window.addEventListener('resize', function () { scrollThreshold = Math.max(360, Math.round(window.innerHeight * 0.55)); updateDockVisibility(); });

    var blockers = [];
    if (formSection) blockers.push(formSection);
    document.querySelectorAll('.cta-section, .contact-section, #contact, #devis-express').forEach(function (el) { if (blockers.indexOf(el) === -1) blockers.push(el); });
    if ('IntersectionObserver' in window && blockers.length) {
      var observer = new IntersectionObserver(function (entries) { dockBlocked = entries.some(function (entry) { return entry.isIntersecting; }); updateDockVisibility(); }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      blockers.forEach(function (el) { observer.observe(el); });
    }
    updateDockVisibility();

    if (!document.querySelector('.sticky-mobile')) {
      var mobileDock = document.createElement('nav'); mobileDock.className = 'conversion-mobile'; mobileDock.setAttribute('aria-label', 'Contact rapide');
      mobileDock.innerHTML = '<a href="tel:+33761092626" class="conversion-mobile-call">Appeler</a><a href="https://wa.me/33761092626" class="conversion-mobile-whatsapp">WhatsApp</a><a href="' + quoteHref + '" class="conversion-mobile-quote" data-cta="quote">Mission</a>';
      document.body.appendChild(mobileDock);
    }
  });
})();
