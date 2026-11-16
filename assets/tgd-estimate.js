(function(){
'use strict';
var form=document.getElementById('estimate-form');if(!form)return;
var routes=[],destination=document.getElementById('estimate-destination'),result=document.getElementById('estimate-result'),status=document.getElementById('estimate-status');
var money=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
function selection(){return {offer:form.querySelector('input[name=offer]:checked').value,origin:document.getElementById('estimate-origin').value,energy:document.getElementById('estimate-energy').value,count:document.getElementById('estimate-count').value,route:routes.find(function(r){return r.department===destination.value;})};}
fetch('/assets/tgd-estimate-routes.json').then(function(r){if(!r.ok)throw Error('routes');return r.json();}).then(function(data){routes=data;data.slice().sort(function(a,b){return a.city.localeCompare(b.city,'fr');}).forEach(function(r){var option=document.createElement('option');option.value=r.department;option.textContent=r.city+' ('+r.department.padStart(2,'0')+')';destination.appendChild(option);});}).catch(function(){status.textContent='Les références de trajet sont momentanément indisponibles. Vous pouvez demander votre devis directement.';destination.required=false;});
form.addEventListener('change',function(){result.hidden=true;status.textContent='';var s=selection();destination.required=s.offer==='delivery'&&s.origin==='idf'&&s.count==='1'&&routes.length>0;try{sessionStorage.removeItem('tgd-estimate-brief');}catch(_e){}});
form.addEventListener('submit',function(e){e.preventDefault();var s=selection();if(s.offer==='delivery'&&s.origin==='idf'&&s.count==='1'&&!s.route&&routes.length){status.textContent='Choisissez une ville de référence pour estimer la livraison.';destination.focus();return;}
var priced=s.offer==='delivery'&&s.origin==='idf'&&s.count==='1'&&s.route;
document.getElementById('estimate-result-title').textContent=priced?'Estimation de votre livraison':'Une étude adaptée à votre mission';
document.getElementById('estimate-distance').textContent=s.route&&s.origin==='idf'?'Référence Île-de-France → '+s.route.city+' : environ '+Math.round(s.route.km)+' km depuis Charenton-le-Pont.':'';
document.getElementById('estimate-price').textContent=priced?money.format(s.route[s.energy])+' HT · '+money.format(s.route[s.energy]*1.2)+' TTC':'Sur devis personnalisé';
var summary=priced?'Repère indicatif pour une livraison avec lavage et mise en main complète. Véhicule '+(s.energy==='electric'?'électrique.':'thermique ou hybride.'):s.offer==='transfer'?'Transfert avec état des lieux et remise des clés, sans mise en main complète. Le tarif du convoyage seul est étudié selon votre trajet.':s.offer==='driver'?'Vous voyagez dans votre propre véhicule. Nous étudions le trajet, l’horaire, l’acheminement et le retour du chauffeur.':'Les volumes, les départs hors Île-de-France et les trajets spécifiques font l’objet d’une organisation et d’une tarification adaptées.';
if(s.count==='multiple')summary+=' Besoin de plusieurs véhicules ou de missions récurrentes : volume à préciser.';
document.getElementById('estimate-summary').textContent=summary;
var note=result.querySelector('.estimate-note');note.textContent=priced?'Énergie et péages exclus. Retour du convoyeur inclus dans cette référence de livraison au départ d’Île-de-France. Prix et disponibilité confirmés uniquement par devis. Votre demande ne réserve pas de mission.':'Les prestations, les frais inclus et exclus, le prix et la disponibilité sont précisés au devis avant confirmation de mission.';
var brief={expires:Date.now()+30*60*1000,service:s.offer,departure:s.origin==='idf'?'Île-de-France — adresse à préciser':'Départ hors Île-de-France — adresse à préciser',destination:s.route?s.route.city:'',summary:summary+(priced?' Estimation indicative en prévisualisation : '+s.route[s.energy]+' € HT, énergie et péages exclus.':'')};
try{sessionStorage.setItem('tgd-estimate-brief',JSON.stringify(brief));}catch(_e){}
document.getElementById('estimate-continue').href='/contact?service='+(s.offer==='driver'?'chauffeur-vehicule-client':s.offer==='transfer'?'convoyage-seul':'livraison-mise-en-main');
result.hidden=false;result.focus();status.textContent='Votre repère est affiché. Il ne constitue pas un devis ferme.';
});
})();
