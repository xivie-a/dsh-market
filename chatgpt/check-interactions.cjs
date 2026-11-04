// Run the actual preview script against a minimal DOM adapter to verify state
// transitions. This checks application logic, not browser layout or rendering.
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
class Node {
  constructor() { this.innerHTML=''; this.textContent=''; this.value=''; this.open=false; this.dataset={}; this.attributes={}; this.listeners={}; this.classes=new Set(); this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),contains:c=>this.classes.has(c),toggle:(c,v)=>{const b=v===undefined?!this.classes.has(c):v;b?this.classes.add(c):this.classes.delete(c);return b}}; }
  setAttribute(k,v){this.attributes[k]=v} removeAttribute(k){delete this.attributes[k]} hasAttribute(k){return k in this.attributes}
  addEventListener(k,f){this.listeners[k]=f} append(){} focus(){} scrollIntoView(){} matches(){return false}
  showModal(){this.open=true} close(){this.open=false;this.listeners.close?.()}
}
const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s)};
const document={querySelector:get,querySelectorAll:()=>[],body:new Node(),activeElement:null,addEventListener(){}};
const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
const timers=[];
const ctx=vm.createContext({document,localStorage:storage,window:{addEventListener(){},scrollTo(){}},matchMedia:()=>({matches:false}),setTimeout:f=>{timers.push(f);return timers.length},clearTimeout(){},URL,console,navigator:{clipboard:{writeText:async()=>{}}}});
const run=s=>vm.runInContext(s,ctx);
get('#sort').value='recommended';scripts.forEach(run);
assert.equal(run('plugins.length'),60);
assert.match(get('#grid').innerHTML,/class="card"/);
assert.equal(run('filtered().length'),60);
run("query='nonexistent-query-xyz';render()");assert.equal(run('filtered().length'),0);assert.match(get('#grid').innerHTML,/清除当前筛选/);
run("query='';category='appearance';render()");assert.ok(run("filtered().every(p=>p.metadata.category==='appearance')"));
run("category='';toggleFavorite(plugins[0].name);navigate('favorites')");assert.equal(run('filtered().length'),1);assert.ok(JSON.parse(values.get('dsh-market-concept-v2')).favorites.length===1);
run('toggleFavorite(plugins[0].name)');assert.equal(run('favorites.size'),0);run('undoAction()');assert.equal(run('favorites.size'),1);
run('showSlide(4)');assert.equal(run('slide'),1);run('showSlide(-1)');assert.equal(run('slide'),2);
run('open(plugins[0])');assert.equal(get('#detail').open,true);assert.match(get('#drawerbody').innerHTML,/你可能也喜欢/);
run("tab='versions';renderDetail()");assert.match(get('#drawerbody').innerHTML,/共 /);
run("$('#detail').close();showCommands()");assert.equal(get('#command').open,true);assert.equal(run('commandMatches.length'),7);
get('#commandSearch').value='nonexistent-query-xyz';run('renderCommands()');assert.equal(run('commandMatches.length'),0);assert.ok(!('aria-activedescendant' in get('#commandSearch').attributes));
async function finish(){
  const name=run('plugins[1].name');run('install(plugins[1].name)');assert.equal(run('busy.size'),1);
  timers.at(-1)();await new Promise(resolve=>setImmediate(resolve));assert.ok(run('installed.has(plugins[1].name)'));assert.equal(run('busy.size'),0);
  run('undoAction()');assert.equal(run('installed.size'),0);
  run('install(plugins[2].name)');const pending=timers.at(-1);run("$('#reset').onclick()");pending();await new Promise(resolve=>setImmediate(resolve));assert.equal(run('installed.size'),0);assert.equal(run('busy.size'),0);
  run('undoAction()');assert.equal(run('favorites.size'),1);
  console.log('PASS: 60-plugin catalog, search, categories, favorites persistence and undo, featured cycling, detail tabs, command search, async add/undo, reset during pending operation.');
}
finish().catch(e=>{console.error(e);process.exitCode=1});
