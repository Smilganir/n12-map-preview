/* Preview-only instrumentation. Not loaded by either application bundle. */
(()=>{
 const prefix='n12-ladder:v1:',synthetic=location.pathname.endsWith('/diagnostic.html');
 const box=document.createElement('aside');box.id='preview-diagnostic';box.dir='ltr';box.style.cssText='position:fixed;z-index:2147483647;left:3px;right:3px;top:3px;background:#fff9d9;color:#172431;border:2px solid #aa6700;padding:5px;font:11px/1.3 monospace;max-height:108px;overflow:auto;text-align:left';
 box.innerHTML='<b>PREVIEW '+(synthetic?'SYNTHETIC test':'N12 reconstruction')+'</b> - not publisher acceptance<br><span id="diag-state">waiting for Stage B</span><br>';
 document.body.append(box);
 const state=box.querySelector('#diag-state');let last='',busy=false;
 const frame=()=>[...document.querySelectorAll('iframe')].find(f=>f.src.includes('/n12-map-preview/candidate-ladder/'));
 function update(){try{if(!box.isConnected)document.body.append(box);const f=frame(),b=f?.contentWindow?.__N12_BREAKER__;if(!b){state.textContent='waiting for Stage B iframe';return}let failures=0;for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)?.startsWith(prefix+'failure:'))failures++;
 const current=localStorage.getItem(prefix+'run:'+b.tab);state.textContent='mode='+b.mode+' reason='+b.reason+' failures='+failures+' armed='+(current?JSON.parse(current).armed:'none');
 const stamp=b.mode+':'+b.run;if(last!==stamp){last=stamp;const k='n12-preview-diagnostic-history';let a=JSON.parse(localStorage.getItem(k)||'[]');a.push({time:new Date().toISOString(),mode:b.mode,reason:b.reason,run:b.run,failures,kind:synthetic?'synthetic-harness':'N12-reconstruction'});localStorage.setItem(k,JSON.stringify(a.slice(-30)));}
 }catch(e){state.textContent='diagnostic read error: '+e.name}}
 if(!synthetic){const jump=document.createElement('button');jump.textContent='Jump to candidate';jump.style.cssText='font:11px sans-serif';jump.onclick=()=>frame()?.scrollIntoView({block:'start'});box.append(jump)}
 update();setInterval(update,700);
})();
