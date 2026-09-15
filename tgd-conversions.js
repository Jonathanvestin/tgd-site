(function(){
'use strict';

var BUSINESS_ID='https://www.thegentlemandriver.fr/#business';
var PERSON_ID='https://www.thegentlemandriver.fr/a-propos#jonathan-vestin';

function track(name,properties){
  var safe=properties||{};
  if(typeof window.va==='function')window.va('event',{name:name,data:safe});
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(Object.assign({event:name},safe));
}

function installUnifiedNav(){
  var links=document.querySelector('.nav-links');
  if(links)links.innerHTML='<li><a href="/convoyage">Convoyage</a></li><li class="nav-dropdown"><a href="/solutions-professionnelles" class="nav-dropdown-toggle">Solutions Pro</a><ul class="nav-dropdown-menu"><li><a href="/solutions-professionnelles">Vue d\'ensemble</a></li><li><a href="/tgd-fleet">TGD Fleet</a></li><li><a href="/tgd-automotive">TGD Automotive</a></li><li><a href="/tgd-digital">TGD Digital</a></li><li><a href="/convoyage-concession">Concessions</a></li></ul></li><li><a href="/chauffeur">Chauffeur</a></li><li><a href="/particuliers">Particuliers</a></li><li><a href="/a-propos">À propos</a></li>';

  var legacyLinks=document.querySelector('.navlinks');
  if(legacyLinks)legacyLinks.innerHTML='<a href="/convoyage">Convoyage</a><a href="/solutions-professionnelles">Solutions Pro</a><a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a><a href="/a-propos">À propos</a><a class="navcta" href="/contact">Confier une mission</a>';

  var navCta=document.querySelector('nav .nav-cta');
  if(navCta){navCta.href='/contact';navCta.textContent='Confier une mission';}

  var mm=document.querySelector('.mobile-menu');
  if(mm){
    var close=mm.querySelector('.mobile-close');
    var closeHtml=close?close.outerHTML:'<button type="button" class="mobile-close" aria-label="Fermer le menu">✕</button>';
    mm.innerHTML=closeHtml+'<a href="/convoyage">Convoyage</a><a href="/solutions-professionnelles">Solutions Pro</a><div class="tgd-mobile-sub"><a href="/tgd-fleet">Fleet</a><a href="/tgd-automotive">Automotive</a><a href="/tgd-digital">Digital</a></div><a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a><a href="/a-propos">À propos</a><a href="/contact" class="btn-primary">Confier une mission</a>';
    var cb=mm.querySelector('.mobile-close');if(cb)cb.onclick=function(){mm.classList.remove('open');};
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('open');});});
  }

  var legacyMobile=document.querySelector('.mobile');
  if(legacyMobile)legacyMobile.innerHTML='<a href="/convoyage">Convoyage</a><a href="/solutions-professionnelles">Solutions Pro</a><a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a><a href="/a-propos">À propos</a><a href="/contact">Confier une mission</a>';

  document.querySelectorAll('a[href="/entreprises"]').forEach(function(a){a.href='/solutions-professionnelles';});
  document.querySelectorAll('a[href="/chauffeur-longue-distance"]').forEach(function(a){a.href='/chauffeur';if((a.textContent||'').trim())a.textContent='Chauffeur avec votre véhicule';});
  document.querySelectorAll('a[href="/convoyage-premium/"]').forEach(function(a){a.href='/convoyage-luxe';});
  document.querySelectorAll('select[name="type_mission_1"]').forEach(function(select){Array.prototype.forEach.call(select.options,function(option){if((option.textContent||'').trim()==='Solutions entreprises')option.textContent='Solutions professionnelles / Fleet';});});

  if(!document.getElementById('tgd-unified-nav-style')){
    var st=document.createElement('style');st.id='tgd-unified-nav-style';
    st.textContent='.nav-links{align-items:center}.nav-dropdown{position:relative}.nav-dropdown-menu{display:none;position:absolute;top:100%;left:-1rem;min-width:225px;padding:.55rem;background:rgba(10,10,10,.99);border:1px solid rgba(201,169,110,.16);box-shadow:0 18px 45px rgba(0,0,0,.28);z-index:220}.nav-dropdown:hover .nav-dropdown-menu{display:block}.nav-dropdown-menu li{list-style:none}.nav-dropdown-menu a{display:block!important;padding:.68rem .75rem!important;font-size:.7rem!important;text-transform:none!important;letter-spacing:.035em!important}.tgd-mobile-sub{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin:-.65rem 0 .1rem}.tgd-mobile-sub a{font-family:Montserrat,sans-serif!important;font-size:.68rem!important;text-transform:uppercase;letter-spacing:.1em;color:#c9a96e!important}@media(max-width:900px){.mobile-menu{justify-content:flex-start!important;padding-top:6.1rem!important;gap:1.1rem!important;overflow-y:auto}.mobile-menu>a:not(.btn-primary){font-size:1.38rem!important}.mobile-menu>.btn-primary{margin-top:.2rem!important}}';
    document.head.appendChild(st);
  }
}

function installUnifiedFooter(){
  var footer=document.querySelector('footer.footer-mini,footer.b2b-footer,body>footer');
  if(!footer)return;
  footer.className='footer-mini';
  footer.innerHTML='<a href="/" class="footer-logo"><img src="/assets/images/logo-the-gentleman-driver-2.png" alt="The Gentleman Driver" style="height:32px;width:auto;display:block;opacity:.75" width="800" height="213" loading="lazy" decoding="async"></a><ul class="footer-links-list"><li class="footer-group-label">Services</li><li><a href="/convoyage">Convoyage</a></li><li><a href="/chauffeur">Chauffeur</a></li><li><a href="/mise-en-main">Mise en main</a></li><li><a href="/transport-plateau">Plateau</a></li><li class="footer-sep">·</li><li class="footer-group-label">Professionnels</li><li><a href="/solutions-professionnelles">Solutions Pro</a></li><li><a href="/tgd-fleet">Fleet</a></li><li><a href="/tgd-automotive">Automotive</a></li><li><a href="/tgd-digital">Digital</a></li><li class="footer-sep">·</li><li class="footer-group-label">TGD</li><li><a href="/a-propos">À propos</a></li><li><a href="/etudes-de-cas">Études de cas</a></li><li><a href="/blog">Blog</a></li><li><a href="/faq">FAQ</a></li><li><a href="/contact">Contact</a></li><li><a href="/mentions-legales">Mentions légales</a></li></ul><span class="footer-copy">© 2026 The Gentleman Driver — SASU — Charenton-le-Pont (94)</span><span class="footer-legal-mini">SIRET 985 178 466 00019 · RCS Créteil · Assurance RC Pro</span>';

  if(!document.getElementById('tgd-unified-footer-style')){
    var s=document.createElement('style');s.id='tgd-unified-footer-style';
    s.textContent='footer.footer-mini{background:#111!important;border-top:1px solid rgba(201,169,110,.06)!important;padding:2.5rem 4vw!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:1.4rem!important;text-align:center!important}footer.footer-mini a.footer-logo{display:block!important;text-decoration:none!important}footer.footer-mini ul.footer-links-list{display:flex!important;flex-direction:row!important;justify-content:center!important;align-items:center!important;gap:1rem 1.5rem!important;list-style:none!important;flex-wrap:wrap!important;margin:0!important;padding:0!important;max-width:1080px!important}footer.footer-mini ul.footer-links-list li{margin:0!important;padding:0!important;list-style:none!important}footer.footer-mini ul.footer-links-list a{font-family:Montserrat,sans-serif!important;font-size:.75rem!important;color:rgba(214,208,198,.72)!important;text-decoration:none!important;font-weight:300!important}footer.footer-mini ul.footer-links-list a:hover{color:#F5F0E8!important}footer.footer-mini .footer-group-label{font-family:Montserrat,sans-serif!important;font-size:.75rem!important;letter-spacing:.2em!important;text-transform:uppercase!important;color:#C9A96E!important;font-weight:500!important;opacity:.7!important}footer.footer-mini .footer-sep{color:rgba(201,169,110,.25)!important}footer.footer-mini .footer-copy{font-family:Montserrat,sans-serif!important;font-size:.75rem!important;color:rgba(214,208,198,.55)!important;font-weight:300!important}footer.footer-mini .footer-legal-mini{display:block!important;margin-top:-.7rem!important;font-family:Montserrat,sans-serif!important;font-size:.7rem!important;color:rgba(214,208,198,.42)!important;font-weight:300!important;letter-spacing:.04em!important}@media(max-width:600px){footer.footer-mini{padding:2.2rem 5vw 5rem!important}footer.footer-mini ul.footer-links-list{gap:.8rem 1rem!important}}';
    document.head.appendChild(s);
  }
}

function normalizeSchemas(){
  function walk(node){
    if(!node||typeof node!=='object')return;
    if(Array.isArray(node)){node.forEach(walk);return;}
    if(node['@id']==='https://www.thegentlemandriver.fr/#organization')node['@id']=BUSINESS_ID;
    if(node.email==='contact@the-gentleman-driver.com')delete node.email;
    if((node['@type']==='LocalBusiness'||node['@type']==='Organization'||(Array.isArray(node['@type'])&&node['@type'].indexOf('LocalBusiness')!==-1))&&node.name==='The Gentleman Driver')node['@id']=BUSINESS_ID;
    if(node['@type']==='BlogPosting'){
      node.author={'@type':'Person','@id':PERSON_ID,name:'Jonathan Vestin',url:'https://www.thegentlemandriver.fr/a-propos'};
      node.publisher={'@type':'Organization','@id':BUSINESS_ID,name:'The Gentleman Driver',url:'https://www.thegentlemandriver.fr/'};
    }
    Object.keys(node).forEach(function(k){walk(node[k]);});
  }
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script){
    try{
      var data=JSON.parse(script.textContent||'{}');
      if(data['@type']==='ContactPage'){
        data['@id']='https://www.thegentlemandriver.fr/contact#webpage';
        data.name='Contact et devis | The Gentleman Driver';
        data.mainEntity={'@id':BUSINESS_ID};
      }else walk(data);
      script.textContent=JSON.stringify(data);
    }catch(e){}
  });
}

function polishHome(){
  if(!document.body.classList.contains('site-home'))return;
  var ticker=document.querySelector('.ticker-inner');
  if(ticker){
    ticker.innerHTML=ticker.innerHTML.replace(/Livraison 0 km/g,'Transport sur plateau').replace(/Solutions entreprises/g,'Solutions professionnelles');
  }
}

function polishContact(path){
  if(path!=='/contact'&&path!=='/contact.html')return;
  document.querySelectorAll('a[href="mailto:contact@the-gentleman-driver.com"]').forEach(function(a){a.removeAttribute('href');a.textContent='Formulaire de contact';a.style.pointerEvents='none';});
  document.querySelectorAll('a[href="/politique-confidentialite"]').forEach(function(a){a.href='/mentions-legales#donnees-personnelles';a.textContent='Données personnelles';});
  document.querySelectorAll('.trust-item').forEach(function(el){
    var txt=(el.textContent||'').trim();
    if(txt.indexOf('Devis 2h')!==-1)el.textContent='Réponse habituelle sous 2h · selon disponibilité';
    if(txt.indexOf('5/5 Google')!==-1)el.textContent='★ Avis Google';
  });
  var reassurance=document.querySelectorAll('.r-item');
  if(reassurance.length>=4){
    reassurance[1].querySelector('.r-title').textContent='Tarif confirmé avant la mission';
    reassurance[1].querySelector('.r-sub').textContent='Selon le devis accepté';
    reassurance[3].querySelector('.r-title').textContent='Interlocuteur identifié';
    reassurance[3].querySelector('.r-sub').textContent='Suivi adapté à la mission';
  }
}

function injectSeoHub(path){
  if(path!=='/'&&path!=='/convoyage')return;
  if(document.getElementById('tgd-seo-link-hub'))return;
  var footer=document.querySelector('footer.footer-mini,footer');if(!footer)return;
  var style=document.createElement('style');style.id='tgd-seo-link-hub-style';style.textContent='#tgd-seo-link-hub{padding:2.3rem 4vw;background:#111;border-top:1px solid rgba(201,169,110,.08);text-align:center}#tgd-seo-link-hub .hub-inner{max-width:1050px;margin:0 auto}#tgd-seo-link-hub h2{font-family:Cormorant Garamond,serif;font-size:clamp(1.4rem,2.5vw,1.9rem);font-weight:300;color:#F5F0E8;margin:0 0 .5rem}#tgd-seo-link-hub p{font-size:.74rem;color:#D6D0C6;margin:0 auto 1rem;max-width:720px;line-height:1.65}#tgd-seo-link-hub .hub-links{display:flex;flex-wrap:wrap;justify-content:center;gap:.45rem}#tgd-seo-link-hub .hub-links a{display:inline-block;padding:.42rem .65rem;border:1px solid rgba(201,169,110,.16);color:#D8D0C2;text-decoration:none;font-size:.7rem;line-height:1.2}#tgd-seo-link-hub .hub-links a:hover{border-color:#C9A96E;color:#C9A96E;background:rgba(201,169,110,.04)}@media(max-width:600px){#tgd-seo-link-hub{padding:2rem 5vw}}';document.head.appendChild(style);
  var section=document.createElement('section');section.id='tgd-seo-link-hub';section.setAttribute('aria-label','Nos services et zones de convoyage');section.innerHTML='<div class="hub-inner"><h2>Convoyage automobile en France et en Europe</h2><p>Accédez à nos expertises et aux principales zones de mission.</p><div class="hub-links"><a href="/convoyage-paris">Paris</a><a href="/convoyage-lyon">Lyon</a><a href="/convoyage-marseille">Marseille</a><a href="/convoyage-bordeaux">Bordeaux</a><a href="/convoyage-lille">Lille</a><a href="/convoyage-nantes">Nantes</a><a href="/convoyage-toulouse">Toulouse</a><a href="/convoyage-nice">Nice</a><a href="/convoyage-strasbourg">Strasbourg</a><a href="/convoyage-montpellier">Montpellier</a><a href="/convoyage-concession">Concessions</a><a href="/convoyage-electrique">Véhicules électriques</a><a href="/convoyage-luxe">Prestige & collection</a><a href="/chauffeur">Chauffeur avec votre véhicule</a><a href="/transport-plateau">Transport sur plateau</a></div></div>';
  footer.parentNode.insertBefore(section,footer);
}

function prefillContact(path){
  var requestedService=new URLSearchParams(location.search).get('service');if(!requestedService)return;
  var normalizedService=requestedService.toLowerCase();
  var profileByService={'convoyage-concession':'Concession / Marchand','besoin-concession-recurrent':'Concession / Marchand','gestion-flotte':'Gestionnaire de flotte','besoin-flotte-recurrent':'Gestionnaire de flotte'};
  var contextOnly={'mission-documentee':true,'tgd-digital':true,'chauffeur-vehicule-client':true,'chauffeur-longue-distance':true};
  var chauffeur={'chauffeur-vehicule-client':true,'chauffeur-longue-distance':true};
  if(path==='/contact'&&(profileByService[normalizedService]||contextOnly[normalizedService])){
    var profileSelect=document.querySelector('select[name="vous_etes"]');var requestedProfile=profileByService[normalizedService];
    if(profileSelect&&requestedProfile)Array.prototype.some.call(profileSelect.options,function(option){if((option.textContent||'').trim()===requestedProfile){profileSelect.value=option.value;return true;}return false;});
    var form=document.getElementById('form-contact');if(!form)return;
    var contextField=form.querySelector('input[name="contexte_demande"]');if(!contextField){contextField=document.createElement('input');contextField.type='hidden';contextField.name='contexte_demande';form.appendChild(contextField);}contextField.value=normalizedService;
    if(chauffeur[normalizedService]){
      var missionField=form.querySelector('input[name="type_mission"]');var button=form.querySelector('.type-btn[data-value="Chauffeur avec mon vehicule"]');
      form.querySelectorAll('.type-btn').forEach(function(b){b.classList.remove('selected');});if(button)button.classList.add('selected');if(missionField)missionField.value='Chauffeur avec mon vehicule';
    }
  }
}

function installConversionDock(path){
  if(path==='/'||path==='/chauffeur'||path==='/chauffeur.html'||path==='/contact'||path==='/contact.html'||document.body.classList.contains('tgd-b2b'))return;
  var form=document.querySelector('.tgd-form'),quoteHref='/contact?service='+encodeURIComponent(path.replace(/^\//,'')||'accueil'),formSection=null;
  if(form){formSection=form.closest('section')||form.parentElement;formSection.id=formSection.id||'devis-express';quoteHref='#'+formSection.id;}
  if(document.querySelector('.conversion-dock'))return;
  var dock=document.createElement('aside');dock.className='conversion-dock';dock.setAttribute('aria-label','Contact rapide');dock.setAttribute('aria-hidden','true');dock.innerHTML='<span><strong>Une mission à organiser&nbsp;?</strong><small>Réponse directe, sans call center</small></span><a href="tel:+33761092626" class="conversion-dock-phone">07 61 09 26 26</a><a href="'+quoteHref+'" class="conversion-dock-quote" data-cta="quote">Confier une mission</a>';document.body.appendChild(dock);
  var blocked=false,threshold=Math.max(360,Math.round(window.innerHeight*.55));
  function update(){var show=window.scrollY>threshold&&!blocked;dock.classList.toggle('is-visible',show);dock.setAttribute('aria-hidden',show?'false':'true');}
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',function(){threshold=Math.max(360,Math.round(window.innerHeight*.55));update();});
  var blockers=[];if(formSection)blockers.push(formSection);document.querySelectorAll('.cta-section,.contact-section,#contact,#devis-express').forEach(function(el){if(blockers.indexOf(el)===-1)blockers.push(el);});
  if('IntersectionObserver'in window&&blockers.length){var observer=new IntersectionObserver(function(entries){blocked=entries.some(function(entry){return entry.isIntersecting;});update();},{rootMargin:'0px 0px -10% 0px',threshold:.08});blockers.forEach(function(el){observer.observe(el);});}
  update();
  if(!document.querySelector('.conversion-mobile')){var mobile=document.createElement('nav');mobile.className='conversion-mobile';mobile.setAttribute('aria-label','Contact rapide');mobile.innerHTML='<a href="tel:+33761092626" class="conversion-mobile-call">Appeler</a><a href="https://wa.me/33761092626" class="conversion-mobile-whatsapp">WhatsApp</a><a href="'+quoteHref+'" class="conversion-mobile-quote" data-cta="quote">Mission</a>';document.body.appendChild(mobile);}
}

document.addEventListener('click',function(event){
  var link=event.target.closest('a');if(!link)return;
  var href=link.getAttribute('href')||'',label=(link.textContent||'').trim().slice(0,80);
  if(href.indexOf('tel:')===0)track('contact_phone',{page:location.pathname,label:label});
  if(href.indexOf('https://wa.me/')===0)track('contact_whatsapp',{page:location.pathname,label:label});
  if(link.matches('[data-audience]'))track('audience_choice',{page:location.pathname,audience:link.getAttribute('data-audience')});
  if(link.matches('[data-cta="quote"]'))track('quote_cta',{page:location.pathname,label:label});
  var customEvent=link.getAttribute('data-track');if(customEvent&&/^[a-z0-9_]+$/.test(customEvent))track(customEvent,{page:location.pathname,label:label,destination:href.split('?')[0]});
});

document.addEventListener('tgd:form-success',function(event){
  var props={page:location.pathname,form:event.detail&&event.detail.formId?event.detail.formId:'unknown'};
  var field=document.querySelector('form input[name="contexte_demande"]');if(field&&/^[a-z0-9-]+$/.test(field.value))props.context=field.value;
  track('lead_form_success',props);
});

document.addEventListener('DOMContentLoaded',function(){
  var path=location.pathname.replace(/\/+$/,'')||'/';
  installUnifiedNav();
  installUnifiedFooter();
  normalizeSchemas();
  polishHome();
  polishContact(path);
  injectSeoHub(path);
  prefillContact(path);
  if(path!=='/'&&path!=='/chauffeur'&&path!=='/chauffeur.html')document.querySelectorAll('.sticky-mobile,.wa-float,.sticky').forEach(function(el){el.remove();});
  installConversionDock(path);
});
})();
