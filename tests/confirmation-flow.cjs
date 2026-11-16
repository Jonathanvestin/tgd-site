const vm=require('node:vm');const assert=require('node:assert/strict');const {readFileSync}=require('node:fs');const source=readFileSync('assets/tgd-mobile-shell.js','utf8');
function setup(path='/contact',receipt=null,blocked=false){
 const values=new Map(receipt?[['tgd-form-confirmation',JSON.stringify(receipt)]]:[]),scripts=[],listeners={},nodes={};
 ['confirmation-title','confirmation-message','confirmation-next','confirmation-contact'].forEach(id=>nodes[id]={textContent:'',hidden:true});
 const ctx={location:{hostname:'www.thegentlemandriver.fr',pathname:path,assign:url=>ctx.redirect=url},navigator:{doNotTrack:'0'},window:{},URL,Object,Date,sessionStorage:{getItem:k=>{if(blocked)throw Error('storage blocked');return values.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('storage blocked');values.set(k,v)}},document:{readyState:'loading',getElementById:id=>id==='tgd-page-analytics'?scripts.find(s=>s.id===id):nodes[id],createElement:tag=>({tag}),head:{appendChild:s=>scripts.push(s)},addEventListener:(n,f)=>listeners[n]=f}};
 vm.runInNewContext(source,ctx);return {ctx,values,scripts,listeners,nodes};
}
for(const [id,name]of Object.entries({'form-hero':'express','form-contact':'contact','form-mission':'mission'})){
 const a=setup();a.listeners['tgd:form-success']({detail:{formId:id,email:'private@example.fr'}});assert.equal(a.ctx.redirect,'/demande-envoyee/'+name);const receipt=JSON.parse(a.values.get('tgd-form-confirmation'));assert.deepEqual(Object.keys(receipt).sort(),['counted','expires','source']);assert.equal(receipt.source,name);assert.equal(receipt.counted,false);
 const b=setup(a.ctx.redirect,receipt);assert.equal(b.scripts.length,1);assert.match(b.nodes['confirmation-title'].textContent,/transmise/);assert.equal(JSON.parse(b.values.get('tgd-form-confirmation')).counted,true);
 const reload=setup(a.ctx.redirect,JSON.parse(b.values.get('tgd-form-confirmation')));assert.equal(reload.scripts.length,0);assert.match(reload.nodes['confirmation-title'].textContent,/transmise/);
}
assert.equal(setup('/demande-envoyee/contact').scripts.length,0);
assert.equal(setup('/demande-envoyee/contact',{source:'mission',expires:Date.now()+10000,counted:false}).scripts.length,0);
assert.equal(setup('/demande-envoyee/contact',{source:'contact',expires:Date.now()-1,counted:false}).scripts.length,0);
const blocked=setup('/contact',null,true);blocked.listeners['tgd:form-success']({detail:{formId:'form-contact'}});assert.equal(blocked.ctx.redirect,undefined);
console.log('Confirmation: all three sources, receipt isolation, expiry, refresh deduplication, storage fallback passed.');
