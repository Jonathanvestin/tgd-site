(function(){
'use strict';
document.addEventListener('DOMContentLoaded',function(){
var service=new URLSearchParams(location.search).get('service');
if(['convoyage-seul','livraison-mise-en-main','chauffeur-vehicule-client'].indexOf(service)<0)return;
var values={'convoyage-seul':'Convoyage automobile','livraison-mise-en-main':'Mise en main & Livraison','chauffeur-vehicule-client':'Chauffeur avec mon vehicule'};
document.querySelectorAll('.type-btn').forEach(function(button){if(button.dataset.value===values[service])button.click();});
try{var brief=JSON.parse(sessionStorage.getItem('tgd-estimate-brief')||'null');if(!brief||brief.expires<Date.now())return;
var expected={'convoyage-seul':'transfer','livraison-mise-en-main':'delivery','chauffeur-vehicule-client':'driver'};if(brief.service!==expected[service])return;
var fields={adresse_depart:brief.departure,adresse_destination:brief.destination,infos_complementaires:brief.summary};Object.keys(fields).forEach(function(id){var el=document.getElementById(id);if(el&&!el.value)el.value=String(fields[id]||'').slice(0,1200);});
var notice=document.createElement('p');notice.className='estimate-note';notice.textContent='Votre sélection a été reprise. Précisez les adresses et la date pour obtenir votre devis.';document.getElementById('form-contact').prepend(notice);sessionStorage.removeItem('tgd-estimate-brief');
}catch(_e){}
});
})();
