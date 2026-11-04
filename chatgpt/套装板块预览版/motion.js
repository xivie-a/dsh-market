// All effects are progressive enhancement. Core controls work without animation.
(() => {
  if(typeof document.documentElement==='undefined'||typeof MutationObserver==='undefined')return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  const animate=(el,frames,options)=>{
    if(!el||reduced.matches||typeof el.animate!=='function')return;
    return el.animate(frames,{duration:360,easing:'cubic-bezier(.2,.8,.2,1)',...options});
  };
  let tracked=null,frame=0,point={x:0,y:0};
  function resetCard(){if(!tracked)return;tracked.classList.remove('tracking');tracked.style.removeProperty('--tilt-x');tracked.style.removeProperty('--tilt-y');tracked=null}
  const grid=document.querySelector('#grid');
  grid.addEventListener('pointermove',e=>{
    if(!fine.matches||reduced.matches||e.pointerType==='touch')return;
    const card=e.target.closest('.card');if(!card)return;
    if(tracked!==card){resetCard();tracked=card;card.classList.add('tracking')}
    point={x:e.clientX,y:e.clientY};if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;if(!tracked?.isConnected)return;const r=tracked.getBoundingClientRect(),x=Math.min(1,Math.max(0,(point.x-r.left)/r.width)),y=Math.min(1,Math.max(0,(point.y-r.top)/r.height));tracked.style.setProperty('--pointer-x',x*100+'%');tracked.style.setProperty('--pointer-y',y*100+'%');tracked.style.setProperty('--tilt-x',(0.5-y)*3+'deg');tracked.style.setProperty('--tilt-y',(x-0.5)*3+'deg')});
  },{passive:true});
  grid.addEventListener('pointerleave',resetCard);
  grid.addEventListener('focusout',()=>{if(!fine.matches)resetCard()});
  const hero=document.querySelector('.hero');let heroFrame=0,hp={x:0,y:0};
  hero.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=hero.getBoundingClientRect();hp={x:((e.clientX-r.left)/r.width-.5)*10,y:((e.clientY-r.top)/r.height-.5)*8};if(heroFrame)return;heroFrame=requestAnimationFrame(()=>{heroFrame=0;hero.style.setProperty('--art-x',hp.x+'px');hero.style.setProperty('--art-y',hp.y+'px')})},{passive:true});
  hero.addEventListener('pointerleave',()=>{if(heroFrame)cancelAnimationFrame(heroFrame);heroFrame=0;hero.style.setProperty('--art-x','0px');hero.style.setProperty('--art-y','0px')});
  const transient=new Set();
  function removeAfter(el,effect){transient.add(el);const remove=()=>{el.remove();transient.delete(el)};if(effect)effect.finished.then(remove,remove);else remove()}
  document.addEventListener('pointerdown',e=>{
    if(reduced.matches||e.button!==0)return;
    const b=e.target.closest('button');if(!b||b.disabled||b.matches('.card-open,.dot'))return;
    const r=b.getBoundingClientRect();if(!r.width||!r.height)return;
    const clip=document.createElement('span');clip.className='ripple-clip';clip.setAttribute('aria-hidden','true');Object.assign(clip.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',borderRadius:getComputedStyle(b).borderRadius});
    const dot=document.createElement('span');dot.className='ripple-dot';const size=Math.max(r.width,r.height)*2;Object.assign(dot.style,{width:size+'px',height:size+'px',left:e.clientX-r.left-size/2+'px',top:e.clientY-r.top-size/2+'px',background:getComputedStyle(b).color});clip.append(dot);(b.closest('dialog')||document.body).append(clip);
    removeAfter(clip,animate(dot,[{transform:'scale(0)',opacity:.18},{transform:'scale(1)',opacity:0}],{duration:520}));
  },{capture:true,passive:true});
  document.addEventListener('click',e=>{
    if(reduced.matches)return;const b=e.target.closest('[data-favorite],[data-detail-favorite]');if(!b||b.getAttribute('aria-pressed')==='true')return;
    const r=b.getBoundingClientRect(),name=b.dataset.favorite;const host=b.closest('dialog')||document.body;
    const heart=document.createElement('span');heart.className='favorite-burst';heart.textContent='♥';heart.setAttribute('aria-hidden','true');Object.assign(heart.style,{left:r.left+r.width/2-10+'px',top:r.top+r.height/2-10+'px'});host.append(heart);
    removeAfter(heart,animate(heart,[{transform:'translateY(0) scale(.6)',opacity:0},{transform:'translateY(-9px) scale(1.25)',opacity:1,offset:.35},{transform:'translateY(-34px) scale(.8)',opacity:0}],{duration:650}));
    requestAnimationFrame(()=>{const target=name?[...grid.querySelectorAll('[data-favorite]')].find(x=>x.dataset.favorite===name):document.querySelector('[data-detail-favorite]');animate(target,[{transform:'scale(.8)'},{transform:'scale(1.28)',offset:.45},{transform:'scale(1)'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'})});
  },true);
  let revealObserver;
  function revealCards(){resetCard();if(reduced.matches)return;const cards=[...grid.querySelectorAll('.card')];if(typeof IntersectionObserver==='undefined')return;if(!revealObserver)revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){revealObserver.unobserve(entry.target);const i=Number(entry.target.dataset.motionIndex)||0;animate(entry.target,[{opacity:.25,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:450,delay:(i%3)*35})}},{threshold:.08});else revealObserver.disconnect();cards.forEach((c,i)=>{c.dataset.motionIndex=i;revealObserver.observe(c)})}
  new MutationObserver(revealCards).observe(grid,{childList:true});revealCards();
  const detail=document.querySelector('#detail'),command=document.querySelector('#command');
  new MutationObserver(()=>{if(detail.open)animate(detail,[{transform:'translateX(40px)',opacity:.5},{transform:'translateX(0)',opacity:1}],{duration:350})}).observe(detail,{attributes:true,attributeFilter:['open']});
  new MutationObserver(()=>{if(command.open)animate(command,[{opacity:0,translate:'0 -12px',scale:'.98'},{opacity:1,translate:'0 0',scale:'1'}],{duration:260})}).observe(command,{attributes:true,attributeFilter:['open']});
  new MutationObserver(()=>{const panel=document.querySelector('#detailPanel');animate(panel,[{opacity:.3,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:220})}).observe(document.querySelector('#drawerbody'),{childList:true});
  new MutationObserver(()=>{for(const el of hero.querySelectorAll('h2,p'))animate(el,[{opacity:0,translate:'0 9px'},{opacity:1,translate:'0 0'}],{duration:350});animate(hero.querySelector('.core'),[{scale:'.9',opacity:.6},{scale:'1',opacity:1}],{duration:450})}).observe(hero,{attributes:true,attributeFilter:['data-slide']});
  const notice=document.querySelector('#notice');new MutationObserver(()=>{if(!notice.classList.contains('hidden'))animate(notice,[{opacity:0,translate:'0 10px',scale:'.96'},{opacity:1,translate:'0 0',scale:'1'}],{duration:280})}).observe(notice,{attributes:true,attributeFilter:['class'],childList:true});
  reduced.addEventListener?.('change',()=>{if(reduced.matches){resetCard();revealObserver?.disconnect();for(const el of transient)el.remove();transient.clear();document.getAnimations?.().forEach(a=>a.cancel())}else revealCards()});
})();
