/* Additive pointer-following swarm. Does not modify existing page elements. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'2147483646'});
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  let width=0,height=0,dpr=1,frame=0,active=false;
  const pointer={x:-100,y:-100};
  const dots=Array.from({length:26},(_,i)=>({x:-100,y:-100,vx:0,vy:0,phase:i*2.39996}));
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
  resize();addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer.x=e.clientX;pointer.y=e.clientY;active=true},{passive:true});
  addEventListener('pointerout',e=>{if(!e.relatedTarget)active=false});
  const draw=()=>{
    frame++;ctx.clearRect(0,0,width,height);
    if(active){
      dots.forEach((p,i)=>{
        const orbit=9+Math.sqrt(i)*7;
        const angle=p.phase+frame*.018*(i%2?1:-1);
        const tx=pointer.x+Math.cos(angle)*orbit,ty=pointer.y+Math.sin(angle)*orbit;
        p.vx=(p.vx+(tx-p.x)*.055)*.78;p.vy=(p.vy+(ty-p.y)*.055)*.78;
        p.x+=p.vx;p.y+=p.vy;
        ctx.beginPath();ctx.arc(p.x,p.y,i%5===0?2.1:1.2,0,Math.PI*2);
        ctx.fillStyle='rgba(49,92,126,'+(0.20+(1-i/dots.length)*.42)+')';ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden)active=false});
  requestAnimationFrame(draw);
})();
