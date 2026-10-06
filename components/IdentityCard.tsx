'use client';
import {useEffect,useRef} from 'react';
import type {PointerEvent,KeyboardEvent} from 'react';

export default function IdentityCard({paused=false}:{paused?:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const motion=useRef({x:0,y:0,vx:0,vy:0,tx:0,ty:0,dragging:false,id:-1,startX:0,startY:0,originX:0,originY:0,frame:0});
 const startAnimation=useRef<()=>void>(()=>{});
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const m=motion.current,reduced=matchMedia('(prefers-reduced-motion: reduce)');let previous=0;
  const render=(now:number)=>{
   const dt=Math.min((now-previous)/1000,.032)||.016;previous=now;
   if(m.dragging){m.x=m.tx;m.y=m.ty;m.vx=0;m.vy=0}
   else if(reduced.matches||paused){m.x=0;m.y=0;m.vx=0;m.vy=0}
   else{m.vx+=(-m.x*105-m.vx*13)*dt;m.vy+=(-m.y*105-m.vy*13)*dt;m.x+=m.vx*dt;m.y+=m.vy*dt}
   const baseLength=innerWidth<=800?96:190;const angle=Math.atan2(m.x,baseLength+m.y)*180/Math.PI;
   el.style.setProperty('--card-x',`${m.x}px`);el.style.setProperty('--card-y',`${m.y}px`);
   el.style.setProperty('--card-roll',`${-angle*.38}deg`);el.style.setProperty('--strap-angle',`${-angle}deg`);
   el.style.setProperty('--strap-length',`${Math.hypot(m.x,baseLength+m.y)}px`);
   el.style.setProperty('--card-tilt',`${reduced.matches?0:m.x*.07}deg`);
   if(m.dragging||Math.abs(m.x)+Math.abs(m.y)+Math.abs(m.vx)+Math.abs(m.vy)>.2)m.frame=requestAnimationFrame(render);else m.frame=0;
  };
  startAnimation.current=()=>{if(!m.frame){previous=performance.now();m.frame=requestAnimationFrame(render)}};
  startAnimation.current();return()=>{cancelAnimationFrame(m.frame);m.frame=0;startAnimation.current=()=>{}};
 },[paused]);
 const down=(e:PointerEvent<HTMLButtonElement>)=>{if(e.button!==0)return;const m=motion.current;m.id=e.pointerId;m.dragging=true;m.startX=e.clientX;m.startY=e.clientY;m.originX=m.x;m.originY=m.y;m.tx=m.x;m.ty=m.y;e.currentTarget.setPointerCapture(e.pointerId);host.current?.setAttribute('data-dragging','true');startAnimation.current()};
 const move=(e:PointerEvent<HTMLButtonElement>)=>{const m=motion.current;if(!m.dragging||m.id!==e.pointerId)return;const limit=(host.current?.clientWidth||400)*.28;m.tx=Math.max(-limit,Math.min(limit,m.originX+e.clientX-m.startX));m.ty=Math.max(-50,Math.min(135,m.originY+e.clientY-m.startY));startAnimation.current()};
 const release=(e:PointerEvent<HTMLButtonElement>)=>{const m=motion.current;if(m.id!==e.pointerId)return;m.dragging=false;m.id=-1;host.current?.removeAttribute('data-dragging');if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);startAnimation.current()};
 const key=(e:KeyboardEvent<HTMLButtonElement>)=>{const m=motion.current;if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Escape'].includes(e.key))return;e.preventDefault();m.dragging=false;m.x=e.key==='ArrowLeft'?-75:e.key==='ArrowRight'?75:0;m.y=e.key==='ArrowDown'?100:e.key==='ArrowUp'?-35:0;startAnimation.current()};
 return <div className="identity-stage" ref={host}>
  <div className="identity-aura" aria-hidden="true"/><div className="identity-orbit" aria-hidden="true"/>
  <div className="identity-anchor" aria-hidden="true"/><div className="identity-strap" aria-hidden="true"><span>LUQMAN / DEVELOPER</span></div>
  <button type="button" className="identity-card" onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onKeyDown={key} aria-label="Drag Muhammad Luqman's identity card. Use arrow keys to pull it, or Escape to reset." aria-describedby="identity-hint">
   <span className="identity-clip" aria-hidden="true"/><span className="identity-slot" aria-hidden="true"/>
   <span className="identity-inner"><span className="identity-card-header"><span>LUQMAN.DEV</span><span>01 / ENGINEERING</span></span>
    <img src="/luqman-id-photo.svg" width="700" height="700" alt="Muhammad Luqman" draggable={false} fetchPriority="high"/>
    <span className="identity-info"><strong>Muhammad Luqman</strong><span>Full Stack Developer</span><span className="identity-location">Remote Work</span></span>
    <span className="identity-card-footer"><span>DESIGN / BUILD / SHIP</span><span aria-hidden="true">▥▥▥▥</span></span>
   </span><span className="identity-shine" aria-hidden="true"/>
  </button><p id="identity-hint" className="identity-hint">GRAB THE CARD. GIVE IT A PULL.</p>
 </div>
}
