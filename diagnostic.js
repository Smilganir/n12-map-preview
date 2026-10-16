/* Preview-only instrumentation. Not loaded by either application bundle. */
(()=>{
 const prefix='n12-ladder:v1:',synthetic=location.pathname.endsWith('/diagnostic.html');
 const box=document.createElement('aside');box.id='preview-diagnostic';box.dir='ltr';box.style.cssText='position:fixed;z-index:2147483647;left:3px;right:3px;top:3px;background:#fff9d9;color:#172431;border:2px solid #aa6700;padding:5px;font:11px/1.3 monospace;max-height:108px;overflow:auto;text-align:left';
 box.innerHTML='<b>PREVIEW '+(synthetic?'SYNTHETIC test':'N12 reconstruction')+'</b> - not publisher acceptance<br><span id="diag-state">waiting for Stage B</span><br>';
 document.body.append(box);
 const state=box.querySelector('#diag-state');let last='',busy=false;
 const frame=()=>[...document.querySelectorAll('iframe')].find(f=>f.src.includes('/n12-map-preview/stage-b/'));
 function update(){try{if(!box.isConnected)document.body.append(box);const f=frame(),b=f?.contentWindow?.__N12_BREAKER__;if(!b){state.textContent='waiting for Stage B iframe';return}let failures=0;for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)?.startsWith(prefix+'failure:'))failures++;
 const current=localStorage.getItem(prefix+'run:'+b.tab);state.textContent='mode='+b.mode+' reason='+b.reason+' failures='+failures+' armed='+(current?JSON.parse(current).armed:'none');
 const stamp=b.mode+':'+b.run;if(last!==stamp){last=stamp;const k='n12-preview-diagnostic-history';let a=JSON.parse(localStorage.getItem(k)||'[]');a.push({time:new Date().toISOString(),mode:b.mode,reason:b.reason,run:b.run,failures,kind:synthetic?'synthetic-harness':'N12-reconstruction'});localStorage.setItem(k,JSON.stringify(a.slice(-30)));}
 }catch(e){state.textContent='diagnostic read error: '+e.name}}
 if(!synthetic){const jump=document.createElement('button');jump.textContent='Jump to Stage B';jump.style.cssText='font:11px sans-serif';jump.onclick=()=>frame()?.scrollIntoView({block:'start'});box.append(jump)}
 if(synthetic){
 const button=(label,fn)=>{let b=document.createElement('button');b.textContent=label;b.style.cssText='font:11px sans-serif;padding:4px;margin-right:5px';b.onclick=fn;box.append(b)};
 button('Reset test state',async()=>{if(busy)return;busy=true;const f=frame(),src=f.src;f.remove();await new Promise(r=>setTimeout(r,800));for(const store of [localStorage,sessionStorage]){for(let i=store.length-1;i>=0;i--){const k=store.key(i);if(k.startsWith(prefix))store.removeItem(k)}}document.body.insertAdjacentHTML('beforeend','<iframe title="Stage B diagnostic" src="'+src+'"></iframe>');busy=false;});
 button('Synthetic unclean run + reload',async()=>{if(busy)return;const f=frame(),b=f?.contentWindow?.__N12_BREAKER__;if(!b||b.mode==='static')return;busy=true;const src=f.src,key=prefix+'run:'+b.tab;f.remove();await new Promise(r=>setTimeout(r,800));const run=JSON.parse(localStorage.getItem(key));run.armed=true;localStorage.setItem(key,JSON.stringify(run));document.body.insertAdjacentHTML('beforeend','<iframe title="Stage B diagnostic" src="'+src+'"></iframe>');busy=false;});
 }
 update();setInterval(update,700);
})();
