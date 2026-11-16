const {readFileSync}=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const source=readFileSync('tgd-conversions.js','utf8');
function setup(host='www.thegentlemandriver.fr',dnt='0'){
 const scripts=[],listeners={};const ctx={location:{hostname:host,pathname:'/contact'},navigator:{doNotTrack:dnt},window:{},URL,Object,document:{getElementById:id=>scripts.find(s=>s.id===id),createElement:tag=>({tag}),head:{appendChild:s=>scripts.push(s)},addEventListener:(n,fn)=>listeners[n]=fn,querySelector:()=>null}};
 vm.runInNewContext(source,ctx);return{ctx,scripts,listeners};
}
const {ctx,scripts,listeners}=setup();assert.equal(scripts.length,1);assert.equal(scripts[0].src,'/_vercel/insights/script.js');
const before=ctx.window.vaq[0][1];const page=before({type:'pageview',url:'https://www.thegentlemandriver.fr/contact?email=test@example.fr&service=concession#secret'});assert.equal(page.url,'https://www.thegentlemandriver.fr/contact');assert.equal(before({type:'event',url:page.url}),null);
assert.equal(setup('preview.vercel.app').scripts.length,0);assert.equal(setup('www.thegentlemandriver.fr','1').scripts.length,0);
listeners['tgd:form-success']({detail:{formId:'form-contact'}});assert.equal(ctx.window.dataLayer[0].event,'lead_form_success');assert.equal(ctx.window.vaq.length,1);assert.equal(JSON.stringify(ctx.window.dataLayer).includes('test@example.fr'),false);
console.log('Analytics: production only, DNT respected, URL redacted, custom events not sent; passed.');
