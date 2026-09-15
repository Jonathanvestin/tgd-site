// TGD — avis Google, navigation globale et harmonisation de la homepage
(function(){
'use strict';
const FALLBACK=[
 {author:'Théo Launay',rating:5,text:"Mon véhicule m’a été livré par Jonathan. Très sympathique et professionnel, tout s’est parfaitement déroulé, je recommande à 100% !",publishedAt:'2026-06-30T13:06:46Z'},
 {author:'Florent Vial',rating:5,text:"Yvan a été d'un grand professionnalisme lors de la livraison de mon véhicule ! Très agréable, disponible et soucieux de m'expliquer les choses en prenant le temps !",publishedAt:'2026-05-19T20:01:25Z'},
 {author:'Frédéric Bazin',rating:5,text:"C'est le deuxième véhicule BMW que Jonathan me livre. Merci à lui pour ces précieux conseils. Le service est à la hauteur de la marque.",publishedAt:'2026-03-23T15:56:18Z'},
 {author:'Isabelle NDOYE Maddio',rating:5,text:'Super moment passé avec Jonathan ! La livraison de mon nouveau véhicule a été impeccable et soignée.',publishedAt:'2026-03-18T16:15:46Z'},
 {author:'Katia Pariente',rating:5,text:'Service de convoyage automobile impeccable entre Paris et Marseille. Prise en charge simple, échanges fluides et respect des délais.',publishedAt:'2026-02-09T18:51:21Z'}
];
const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const ts=r=>{const v=Date.parse(r?.publishedAt||r?.updateTime||r?.createTime||r?.date||'');return Number.isFinite(v)?v:0};
const norm=r=>({author:r.author||r.authorName||r.reviewer||'Client Google',rating:Number(r.rating)||5,text:r.text||r.comment||r.reviewText||'',publishedAt:r.publishedAt||r.updateTime||r.createTime||r.date||null});
const stars=n=>'★'.repeat(Math.max(0,Math.min(5,Number(n)||0)))+'☆'.repeat(5-Math.max(0,Math.min(5,Number(n)||0)));
function date(r){const v=ts(r);return v?new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(v)):'Avis Google'}
function card(r){r=norm(r);return `<div class="testi"><div class="testi-stars">${stars(r.rating)}</div>${r.text?`<p class="testi-quote">« ${esc(r.text)} »</p>`:''}<div class="testi-author">${esc(r.author)}</div><div class="testi-role">${esc(date(r))} · Google</div></div>`}
function neutralReviewState(){
 document.querySelectorAll('.tgd-rating-score').forEach(e=>{const p=e.parentElement;if(p&&p.textContent.includes('/5 Google'))p.textContent='Avis Google';else e.textContent='Avis Google'});
 document.querySelectorAll('.tgd-rating-total').forEach(e=>{if(e.isConnected)e.textContent=''});
 document.querySelectorAll('.tgd-rating-number').forEach(e=>e.textContent='');
}
function render(w,reviews,rating,total){const ordered=(reviews||[]).map(norm).sort((a,b)=>ts(b)-ts(a));w.forEach(x=>{const m=Math.max(1,parseInt(x.dataset.max||'3',10));x.innerHTML=ordered.slice(0,m).map(card).join('')});const sr=Number(rating),st=Number(total),hasRating=Number.isFinite(sr)&&sr>0,hasTotal=Number.isFinite(st)&&st>0;if(hasRating&&hasTotal){document.querySelectorAll('.tgd-rating-score').forEach(e=>e.textContent=sr.toFixed(1).replace('.',','));document.querySelectorAll('.tgd-rating-total').forEach(e=>e.textContent=`${st} avis`);document.querySelectorAll('.tgd-rating-number').forEach(e=>e.textContent=String(st))}else neutralReviewState()}
function installEntitySchema(){
 if(!document.body.classList.contains('site-home'))return;
 document.querySelectorAll('script[type="application/ld+json"]').forEach(s=>{if((s.textContent||'').includes('thegentlemandriver.fr/#business')||(s.textContent||'').includes('"FAQPage"'))s.remove()});
 if(document.getElementById('tgd-entity-schema'))return;
 const schema={
  '@context':'https://schema.org',
  '@graph':[
   {
    '@type':['ProfessionalService','LocalBusiness'],
    '@id':'https://www.thegentlemandriver.fr/#business',
    name:'The Gentleman Driver',
    legalName:'THE GENTLEMAN DRIVER SASU',
    url:'https://www.thegentlemandriver.fr/',
    telephone:'+33761092626',
    foundingDate:'2021',
    description:'The Gentleman Driver organise des missions de convoyage automobile, mise en main, chauffeur avec le véhicule du client et transport sur plateau en France. Les missions européennes sont étudiées sur devis selon le trajet, la disponibilité, la réglementation, les documents et la faisabilité.',
    address:{'@type':'PostalAddress',streetAddress:'4 rue Jean Pigeon',addressLocality:'Charenton-le-Pont',postalCode:'94220',addressRegion:'Île-de-France',addressCountry:'FR'},
    founder:{'@id':'https://www.thegentlemandriver.fr/#jonathan-vestin'},
    areaServed:[{'@type':'Country',name:'France'},{'@type':'Place',name:'Europe'}],
    knowsAbout:['convoyage automobile','mise en main véhicule','chauffeur avec le véhicule du client','convoyage de véhicules électriques','mouvements de flotte automobile','livraisons VN/VO','transport automobile sur plateau'],
    hasOfferCatalog:{'@type':'OfferCatalog',name:'Services The Gentleman Driver',itemListElement:[
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'Convoyage automobile',url:'https://www.thegentlemandriver.fr/convoyage'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'Mise en main',url:'https://www.thegentlemandriver.fr/mise-en-main'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'Chauffeur avec votre véhicule',url:'https://www.thegentlemandriver.fr/chauffeur'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'Solutions professionnelles',url:'https://www.thegentlemandriver.fr/solutions-professionnelles'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'TGD Fleet',url:'https://www.thegentlemandriver.fr/tgd-fleet'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'TGD Automotive',url:'https://www.thegentlemandriver.fr/tgd-automotive'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'TGD Digital',url:'https://www.thegentlemandriver.fr/tgd-digital'}},
     {'@type':'Offer',itemOffered:{'@type':'Service',name:'Transport sur plateau',url:'https://www.thegentlemandriver.fr/transport-plateau'}}
    ]}
   },
   {
    '@type':'Person',
    '@id':'https://www.thegentlemandriver.fr/#jonathan-vestin',
    name:'Jonathan Vestin',
    jobTitle:'Fondateur et gérant',
    url:'https://www.thegentlemandriver.fr/a-propos',
    worksFor:{'@id':'https://www.thegentlemandriver.fr/#business'},
    description:'Jonathan Vestin possède plus de 25 ans d’expérience entrepreneuriale, distincte de son activité de convoyage automobile exercée depuis 2021.'
   },
   {
    '@type':'WebSite',
    '@id':'https://www.thegentlemandriver.fr/#website',
    url:'https://www.thegentlemandriver.fr/',
    name:'The Gentleman Driver',
    publisher:{'@id':'https://www.thegentlemandriver.fr/#business'},
    inLanguage:'fr-FR'
   }
  ]
 };
 const s=document.createElement('script');s.type='application/ld+json';s.id='tgd-entity-schema';s.textContent=JSON.stringify(schema);document.head.appendChild(s);
}
function installShell(){
 const links=document.querySelector('.nav-links');
 if(links)links.innerHTML='<li><a href="/convoyage">Convoyage</a></li><li class="nav-dropdown"><a href="/solutions-professionnelles" class="nav-dropdown-toggle">Solutions Pro</a><ul class="nav-dropdown-menu"><li><a href="/solutions-professionnelles">Vue d\'ensemble</a></li><li><a href="/tgd-fleet">TGD Fleet</a></li><li><a href="/tgd-automotive">TGD Automotive</a></li><li><a href="/tgd-digital">TGD Digital</a></li><li><a href="/convoyage-concession">Concessions</a></li></ul></li><li><a href="/chauffeur">Chauffeur</a></li><li><a href="/particuliers">Particuliers</a></li><li><a href="/a-propos">À propos</a></li>';
 const cta=document.querySelector('nav .nav-cta');if(cta){cta.href='/contact';cta.textContent='Confier une mission'}
 const mm=document.querySelector('.mobile-menu');if(mm){const close=mm.querySelector('.mobile-close')?.outerHTML||'<button type="button" class="mobile-close" aria-label="Fermer le menu">✕</button>';mm.innerHTML=close+'<a href="/convoyage">Convoyage</a><a href="/solutions-professionnelles">Solutions Pro</a><div class="tgd-mobile-sub"><a href="/tgd-fleet">Fleet</a><a href="/tgd-automotive">Automotive</a><a href="/tgd-digital">Digital</a></div><a href="/chauffeur">Chauffeur</a><a href="/particuliers">Particuliers</a><a href="/a-propos">À propos</a><a href="/contact" class="btn-primary">Confier une mission</a>';const cb=mm.querySelector('.mobile-close');if(cb)cb.onclick=()=>mm.classList.remove('open');mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')))}
 document.querySelectorAll('.footer-links-list').forEach(f=>{f.innerHTML='<li class="footer-group-label">Services</li><li><a href="/convoyage">Convoyage</a></li><li><a href="/chauffeur">Chauffeur</a></li><li><a href="/mise-en-main">Mise en main</a></li><li><a href="/transport-plateau">Plateau</a></li><li class="footer-sep">·</li><li class="footer-group-label">Professionnels</li><li><a href="/solutions-professionnelles">Solutions Pro</a></li><li><a href="/tgd-fleet">Fleet</a></li><li><a href="/tgd-automotive">Automotive</a></li><li><a href="/tgd-digital">Digital</a></li><li class="footer-sep">·</li><li class="footer-group-label">TGD</li><li><a href="/a-propos">À propos</a></li><li><a href="/etudes-de-cas">Études de cas</a></li><li><a href="/blog">Blog</a></li><li><a href="/faq">FAQ</a></li><li><a href="/contact">Contact</a></li><li><a href="/mentions-legales">Mentions légales</a></li>'});
 if(!document.getElementById('tgd-shell-style')){const s=document.createElement('style');s.id='tgd-shell-style';s.textContent='.nav-links{align-items:center}.nav-dropdown-menu{min-width:230px!important}.nav-dropdown-menu a{text-transform:none!important;letter-spacing:.035em!important;font-size:.72rem!important}.tgd-mobile-sub{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin:-.7rem 0 .1rem}.tgd-mobile-sub a{font-family:Montserrat,sans-serif!important;font-size:.7rem!important;text-transform:uppercase;letter-spacing:.11em;color:#c9a96e!important}.footer-links-list{max-width:1080px!important;margin-left:auto!important;margin-right:auto!important;justify-content:center!important}.footer-group-label{color:#c9a96e!important}.footer-sep{opacity:.35}@media(max-width:900px){.mobile-menu{justify-content:flex-start!important;padding-top:6.2rem!important;gap:1.15rem!important}.mobile-menu>a:not(.btn-primary){font-size:1.4rem!important}.mobile-menu>.btn-primary{margin-top:.25rem!important}}';document.head.appendChild(s)}
}
function upgradeHome(){
 if(!document.body.classList.contains('site-home'))return;
 // Le contenu de la Home est désormais piloté directement par le HTML : pas de réécriture éditoriale côté JavaScript.
}
async function load(){installEntitySchema();installShell();upgradeHome();neutralReviewState();const w=document.querySelectorAll('.tgd-reviews-widget'),d=document.querySelectorAll('.tgd-rating-total,.tgd-rating-number,.tgd-rating-score');if(!w.length&&!d.length)return;try{const r=await fetch('/api/reviews',{cache:'no-store'});if(!r.ok)throw 0;const x=await r.json();render(w,Array.isArray(x.reviews)&&x.reviews.length?x.reviews:FALLBACK,x.rating,x.total)}catch(e){render(w,FALLBACK,null,null)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
