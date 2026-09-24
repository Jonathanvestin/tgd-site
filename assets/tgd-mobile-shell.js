/* One mobile navigation across the main site. */
(function () {
  function init() {
    var menu = document.querySelector('.mobile-menu, .mobile, .b2b-mobile');
    var toggle = document.querySelector('button.burger, button.b2b-mobile-toggle');
    var nav = document.querySelector('body > nav');
    if (!nav) return;
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'burger tgd-created-toggle';
      nav.appendChild(toggle);
    }
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'mobile-menu';
      nav.insertAdjacentElement('afterend', menu);
    }

    menu.classList.add('tgd-unified-mobile-menu');
    menu.id = menu.id || 'tgd-mobile-menu';
    menu.setAttribute('aria-label', 'Menu principal');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    toggle.setAttribute('aria-controls', menu.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    menu.innerHTML = '<button type="button" class="tgd-menu-close" aria-label="Fermer le menu">×</button>' +
      '<a href="/">Accueil</a><a href="/convoyage">Convoyage</a>' +
      '<a href="/solutions-professionnelles">Solutions Pro</a>' +
      '<div class="tgd-menu-sub"><a href="/tgd-fleet">Fleet</a><a href="/tgd-automotive">Automotive</a><a href="/tgd-digital">Digital</a></div>' +
      '<a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a>' +
      '<a href="/a-propos">À propos</a><a class="tgd-menu-cta" href="/soumettre-une-mission">Soumettre une mission</a>';

    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('tgd-menu-is-open', open);
      if (open) menu.querySelector('.tgd-menu-close').focus();
      else toggle.focus();
    }
    // Capture the click before page-specific inline and delegated handlers.
    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!menu.classList.contains('open'));
    }, true);
    menu.addEventListener('click', function (event) {
      if (event.target.closest('.tgd-menu-close')) setOpen(false);
      else if (event.target.closest('a')) {
        menu.classList.remove('open');
        document.body.classList.remove('tgd-menu-is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        event.stopImmediatePropagation();
        setOpen(false);
      }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
