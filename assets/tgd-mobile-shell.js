/* One mobile navigation across the main site. */
(function () {
/* A successful form submission leads to its own confirmation page. No personal data is stored here. */
var confirmationKey='tgd-form-confirmation';
var confirmationRoutes={'form-hero':'express','form-contact':'contact','form-mission':'mission'};
function readConfirmation(){
 try{var value=JSON.parse(sessionStorage.getItem(confirmationKey)||'null');return value&&Object.values(confirmationRoutes).indexOf(value.source)!==-1&&value.expires>Date.now()?value:null;}catch(error){return null;}
}
function confirmationSource(){return location.pathname.match(/^\/demande-envoyee\/(express|contact|mission)\/?$/);}
function showConfirmation(){
 var route=confirmationSource(),receipt=readConfirmation();
 if(!route||!receipt||route[1]!==receipt.source)return;
 document.getElementById('confirmation-title').textContent='Votre demande a bien été transmise.';
 document.getElementById('confirmation-message').textContent='Merci. Les informations de votre demande ont été envoyées à The Gentleman Driver.';
 document.getElementById('confirmation-next').hidden=false;
 var link=document.getElementById('confirmation-contact');link.textContent='Consulter nos prestations';link.href='/convoyage';
}
if(location.pathname.indexOf('/demande-envoyee')===0)showConfirmation();
document.addEventListener('tgd:form-success',function(event){
 var source=confirmationRoutes[event.detail&&event.detail.formId];if(!source)return;
 try{sessionStorage.setItem(confirmationKey,JSON.stringify({source:source,expires:Date.now()+30*60*1000,counted:false}));}catch(error){return;}
 location.assign('/demande-envoyee/'+source);
});
/* Web Analytics Hobby: page views only; no paid custom-event collection. */
function installPageAnalytics(){
 if(location.hostname!=='www.thegentlemandriver.fr'||navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
 if(document.getElementById('tgd-page-analytics'))return;
 var route=confirmationSource();
 if(location.pathname.indexOf('/demande-envoyee')===0){
  var receipt=readConfirmation();
  if(!route||!receipt||receipt.source!==route[1]||receipt.counted)return;
  receipt.counted=true;try{sessionStorage.setItem(confirmationKey,JSON.stringify(receipt));}catch(error){return;}
 }
 window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};
 window.va('beforeSend',function(event){
  if(event.type==='event')return null;
  try{var url=new URL(event.url);url.search='';url.hash='';return Object.assign({},event,{url:url.toString()});}catch(error){return null;}
 });
 var script=document.createElement('script');script.id='tgd-page-analytics';script.defer=true;script.src='/_vercel/insights/script.js';document.head.appendChild(script);
}
installPageAnalytics();

  function init() {
    // Replace page-specific mobile contact bars with one consistent action set.
    document.querySelectorAll('.sticky-mobile, .conversion-mobile, body > .sticky').forEach(function (oldBar) {
      oldBar.remove();
    });
    var contactBar = document.createElement('nav');
    contactBar.className = 'tgd-contact-mobile';
    contactBar.setAttribute('aria-label', 'Contact rapide');
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var quoteHref = path === '/contact' || path === '/contact.html' ? '#form-contact' :
      path === '/soumettre-une-mission' ? '#form-mission' :
      path === '/chauffeur' ? '/contact?service=chauffeur-vehicule-client' : '/contact';
    var proServices = {'/mise-en-main':'mise-en-main','/convoyage-electrique':'convoyage-electrique','/tgd-digital':'mission-documentee','/solutions-professionnelles':'solutions-professionnelles','/convoyage-concession':'convoyage-concession','/tgd-fleet':'gestion-flotte'};
    if (proServices[path]) quoteHref = '/contact?service=' + proServices[path];
    contactBar.innerHTML = '<a href="tel:+33763695257" data-cta="phone">Appeler</a>' +
      '<a href="https://wa.me/33763695257" target="_blank" rel="noopener noreferrer" data-cta="whatsapp">WhatsApp</a>' +
      '<a href="' + quoteHref + '" data-cta="quote">Devis</a>';
    document.body.appendChild(contactBar);
    document.body.classList.add('tgd-has-contact-mobile');
    var menu = document.querySelector('.mobile-menu, .mobile, .b2b-mobile');
    var toggle = document.querySelector('button.burger, button.b2b-mobile-toggle');
    var nav = document.querySelector('body > nav');
    if (!nav) return;
    var links = nav.querySelector('.nav-links, .navlinks, .b2b-navlinks');
    if (!links) {
      links = document.createElement('div');
      nav.appendChild(links);
    }
    nav.classList.add('tgd-site-nav');
    links.classList.add('tgd-site-links');
    links.innerHTML = '<li><a href="/convoyage">Convoyage</a></li>' +
      '<li class="tgd-site-dropdown"><a href="/solutions-professionnelles" aria-haspopup="true">Solutions Pro</a>' +
      '<div class="tgd-site-submenu"><a href="/tgd-fleet">TGD Fleet</a><a href="/tgd-automotive">TGD Automotive</a><a href="/tgd-digital">TGD Digital</a><a href="/convoyage-concession">Concessions</a></div></li>' +
      '<li><a href="/chauffeur">Chauffeur</a></li><li><a href="/particuliers">Particuliers</a></li>' +
      '<li><a href="/a-propos">À propos</a></li>' +
      '<li><a class="tgd-site-cta" href="/soumettre-une-mission">Soumettre une mission</a></li>';
    nav.querySelectorAll('.nav-cta, .navcta, .b2b-navcta').forEach(function (oldCta) {
      if (!links.contains(oldCta)) oldCta.remove();
    });
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
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
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
      if (event.key === 'Tab' && menu.classList.contains('open')) {
        var items = menu.querySelectorAll('a[href], button:not([disabled])');
        var first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        event.stopImmediatePropagation();
        setOpen(false);
      }
    }, true);
    var backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'tgd-back-to-top';
    backToTop.setAttribute('aria-label', 'Remonter en haut de la page');
    backToTop.title = 'Remonter en haut';
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);
    function updateBackToTop() {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
