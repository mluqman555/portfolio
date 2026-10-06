'use client';
import {useEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
const steps=[
 {title:'Discover',copy:'Understand the user, the objective and the technical constraints.',tag:'IDEA / PLAN',color:'#73f4c1',rgb:[115,244,193],hue:-45,shape:[50,50,50,50]},
 {title:'Structure',copy:'Turn the idea into a clear architecture and release plan.',tag:'ARCHITECTURE',color:'#77dfff',rgb:[119,223,255],hue:0,shape:[43,48,43,48]},
 {title:'Design',copy:'Build a visual system that is intuitive, distinctive and responsive.',tag:'INTERFACE',color:'#d9a6ff',rgb:[217,166,255],hue:60,shape:[46,54,43,57]},
 {title:'Engineer',copy:'Connect frontend, application logic, APIs and data.',tag:'BUILD / CONNECT',color:'#8cc6ff',rgb:[140,198,255],hue:-15,shape:[40,44,40,44]},
 {title:'Validate',copy:'Test real interactions, edge cases and performance.',tag:'TEST',color:'#c8ffd9',rgb:[200,255,217],hue:-55,shape:[49,49,49,49]},
 {title:'Launch',copy:'Deploy confidently and continue improving the product using real feedback.',tag:'DEPLOY / ITERATE',color:'#ffc683',rgb:[255,198,131],hue:180,shape:[47,53,47,53]},
];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)};
const reveal=(t:number,delay=0)=>ease((t-delay)/.2);
export default function ProcessJourney(){
 const ref=useRef<HTMLDivElement>(null),panels=useRef<(HTMLElement|null)[]>([]);
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[enhanced,setEnhanced]=useState(false);
 const current=useRef(0),enabled=useRef(false);
 useEffect(()=>{
  const el=ref.current;if(!el)return;const preference=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,visible=true,last=-1,mode=false;
  const update=()=>{
   frame=0;const pin=!preference.matches&&innerWidth>800&&innerHeight>650;
   if(pin!==mode){mode=pin;enabled.current=pin;setEnhanced(pin);el.dataset.enhanced=String(pin)}
   if(!pin){
    panels.current.forEach(panel=>{if(panel){panel.style.visibility='visible';panel.style.pointerEvents='auto';panel.removeAttribute('aria-hidden')}});
    const shown=panels.current.map((panel,i)=>({i,r:panel?.getBoundingClientRect()})).filter(p=>p.r&&p.r.top<innerHeight*.7&&p.r.bottom>innerHeight*.2).sort((a,b)=>Math.abs(a.r!.top-innerHeight*.4)-Math.abs(b.r!.top-innerHeight*.4))[0];
    if(shown&&last!==shown.i){last=shown.i;current.current=shown.i;const stage=steps[shown.i];setActive(shown.i);el.dataset.stage=String(shown.i);el.style.setProperty('--forge-accent',stage.color);el.style.setProperty('--forge-rgb',stage.rgb.join(' '));el.style.setProperty('--planet-hue',`${stage.hue}deg`);el.style.setProperty('--shell-shape',stage.shape.map(n=>`${n}%`).join(' '))}
    el.style.setProperty('--extract','1');return
   }
   const box=el.getBoundingClientRect(),viewport=el.querySelector<HTMLElement>('.forge-viewport');const travel=Math.max(1,el.offsetHeight-(viewport?.offsetHeight||innerHeight));
   const progress=clamp((24-box.top)/travel),value=Math.min(5.999,progress*5.75+.25),index=Math.floor(value),local=value-index;
   const incoming=index===0?1:reveal(local),outgoing=index===5?1:1-ease((local-.75)/.24),extraction=incoming*outgoing;
   const morph=ease((local-.76)/.24),next=steps[Math.min(5,index+1)],stage=steps[index];
   const rgb=stage.rgb.map((n,i)=>Math.round(n+(next.rgb[i]-n)*morph));
   el.style.setProperty('--forge-accent',`rgb(${rgb.join(',')})`);el.style.setProperty('--forge-rgb',rgb.join(' '));el.style.setProperty('--forge-progress',String(progress));
   el.style.setProperty('--planet-hue',`${stage.hue+(next.hue-stage.hue)*morph}deg`);el.style.setProperty('--surface-turn',`${value*16}deg`);el.style.setProperty('--shell-turn',`${value*24}deg`);
   el.style.setProperty('--shell-shape',stage.shape.map((n,i)=>`${n+(next.shape[i]-n)*morph}%`).join(' '));
   el.style.setProperty('--extract',String(extraction));el.style.setProperty('--extract-width',`${extraction*100}%`);
   panels.current.forEach((panel,i)=>{if(!panel)return;const shown=i===index;panel.style.visibility=shown?'visible':'hidden';panel.style.pointerEvents=shown?'auto':'none';panel.setAttribute('aria-hidden',String(!shown));if(!shown)return;
    panel.style.setProperty('--emerge-x',`${(1-extraction)*230}px`);panel.style.setProperty('--emerge-z',`${(1-extraction)*-90}px`);
    for(const [key,delay] of [['tag',0],['title',.035],['copy',.075],['rule',.11]] as const){const amount=(index===0?1:reveal(local,delay))*outgoing;const edge=100-amount*100;panel.style.setProperty(`--${key}-mask`,amount>.999?'none':`polygon(${edge}% 0,100% 0,100% 100%,${Math.min(100,edge+2)}% 100%,${Math.max(0,edge-2)}% 78%,${Math.min(100,edge+3)}% 56%,${Math.max(0,edge-1)}% 32%)`)}
   });
   current.current=index;if(last!==index){last=index;el.dataset.stage=String(index);setActive(index)}
  };
  const schedule=()=>{if(!frame&&visible)frame=requestAnimationFrame(update)};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule()},{rootMargin:'200px'});io.observe(el);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);preference.addEventListener('change',schedule);update();
  let pointerFrame=0,px=0,py=0;const move=(e:PointerEvent)=>{if(!mode||e.pointerType==='touch'||el.dataset.paused==='true')return;const r=el.querySelector('.forge-planet-wrap')?.getBoundingClientRect();if(!r)return;px=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/r.width));py=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/r.height));if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;el.style.setProperty('--tilt-x',`${-py*5}deg`);el.style.setProperty('--tilt-y',`${px*5}deg`);el.style.setProperty('--light-x',`${50+px*12}%`);el.style.setProperty('--light-y',`${35+py*12}%`)})};
  const leave=()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');el.style.setProperty('--light-x','50%');el.style.setProperty('--light-y','35%')};el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',leave);
  return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);io.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);preference.removeEventListener('change',schedule);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)};
 },[]);
 const go=(i:number)=>{const el=ref.current;if(!el)return;if(enabled.current){const viewport=el.querySelector<HTMLElement>('.forge-viewport');const travel=el.offsetHeight-(viewport?.offsetHeight||innerHeight);window.scrollTo({top:scrollY+el.getBoundingClientRect().top-24+Math.max(0,(i+.4-.25)/5.75)*travel,behavior:'smooth'})}else{current.current=i;setActive(i);el.dataset.stage=String(i);el.style.setProperty('--forge-accent',steps[i].color);el.style.setProperty('--forge-rgb',steps[i].rgb.join(' '));el.style.setProperty('--planet-hue',`${steps[i].hue}deg`);panels.current[i]?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}};
 return <div className="process-forge" ref={ref} data-enhanced={enhanced} data-stage={active} data-paused={paused} style={{'--forge-accent':steps[active].color,'--forge-rgb':steps[active].rgb.join(' ')} as CSSProperties}>
  <div className="forge-viewport">
   <div className="forge-backdrop" aria-hidden="true"/><div className="forge-grid" aria-hidden="true"/>
   <div className="forge-topline mono"><span className="pipeline-status"><i/> PIPELINE: ACTIVE</span><button type="button" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'RESUME SURFACE MOTION':'PAUSE SURFACE MOTION'}</button></div>
   <div className="forge-intro"><h2>Good products<br/>don’t happen<br/>by accident.</h2><p>A clear process. Connected decisions.<br/>A product that’s ready for the real world.</p></div>
   <div className="forge-planet-wrap" aria-hidden="true">
    <div className="forge-orbit forge-orbit-a"/><div className="forge-orbit forge-orbit-b"/>
    <div className="forge-planet">
     <img src="/process-mechanical-planet.svg" width="560" height="560" alt="" draggable={false}/>
     <div className="forge-surface-light"/><div className="forge-shell"/>
     <svg className="forge-patterns" viewBox="0 0 400 400" fill="none">
      <g className="forge-pattern pattern-discover"><circle cx="200" cy="200" r="137"/><circle cx="200" cy="200" r="92"/><path d="M70 210Q160 90 280 180T355 190M68 235Q180 110 313 222M90 300Q210 250 330 300"/><path d="M200 62V90M338 200H310M200 338V310M62 200H90"/><circle cx="123" cy="180" r="4"/><circle cx="261" cy="268" r="5"/></g>
      <g className="forge-pattern pattern-structure"><path d="M90 80V320M145 60V340M200 50V350M255 60V340M310 80V320M80 90H320M60 145H340M50 200H350M60 255H340M80 310H320"/><path d="M100 100L300 100 300 300 100 300ZM145 145H255V255H145Z"/><circle cx="100" cy="100" r="6"/><circle cx="300" cy="300" r="6"/></g>
      <g className="forge-pattern pattern-design"><path d="M50 210C110 20 250 360 350 160M50 250C150 20 240 365 345 210M60 160C190 350 220 25 345 250M85 100C80 340 320 55 315 310M130 65C70 285 305 80 260 340"/><ellipse cx="200" cy="200" rx="100" ry="145" transform="rotate(40 200 200)"/></g>
      <g className="forge-pattern pattern-engineer"><path d="M65 160H120V100H190V65M70 245H140V295H210V340M330 130H280V195H220V245H280V300M105 200H165V170H245V100H310M190 120V210H110"/><circle cx="190" cy="65" r="7"/><circle cx="210" cy="340" r="7"/><circle cx="310" cy="100" r="6"/><circle cx="280" cy="300" r="6"/><path className="forge-warm-trace" d="M120 100H190V210H245V280"/></g>
      <g className="forge-pattern pattern-validate"><ellipse cx="200" cy="130" rx="125" ry="27"/><ellipse cx="200" cy="200" rx="155" ry="35"/><ellipse cx="200" cy="270" rx="125" ry="27"/><path d="M145 195L183 230 258 150M80 130H100M300 130H320M60 200H90M310 200H340M80 270H100M300 270H320"/></g>
      <g className="forge-pattern pattern-launch"><path d="M75 270Q145 305 335 115M80 295Q160 330 340 170M75 180Q240 50 330 130M130 330L230 85M195 345L290 100"/><circle cx="230" cy="85" r="6"/><circle cx="330" cy="130" r="5"/><circle cx="110" cy="270" r="4"/></g>
     </svg>
     <div className="forge-plate plate-one"/><div className="forge-plate plate-two"/><div className="forge-plate plate-three"/>
    </div>
    <span className="forge-coordinate mono">PRODUCTION SYSTEM / 0{active+1}</span>
    <div className="forge-signal signal-one"/><div className="forge-signal signal-two"/><div className="forge-signal signal-three"/>
   </div>
   <svg className="forge-extraction" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><path d="M770 250C690 180 640 335 570 270S430 260 270 270"/><path d="M770 250C630 245 680 310 570 280S430 272 270 272"/></svg>
   <div className="forge-stage-list">{steps.map((step,i)=><article ref={node=>{panels.current[i]=node}} className="forge-stage" key={step.title} aria-current={active===i?'step':undefined} aria-hidden={enhanced?active!==i:undefined} style={{'--item-accent':step.color} as CSSProperties}>
    <span className="forge-stage-tag mono">0{i+1} <b>{step.tag}</b></span><h3>{step.title}</h3><p>{step.copy}</p><span className="forge-stage-rule"/>
   </article>)}</div>
   <nav className="forge-nav" aria-label="Development process stages">{steps.map((s,i)=><button type="button" key={s.title} onClick={()=>go(i)} aria-current={active===i?'step':undefined}><span>0{i+1}</span><strong>{s.title}</strong><i aria-hidden="true"/></button>)}</nav>
   <div className="forge-progress" aria-hidden="true"><span/></div><span className="forge-scroll mono">SCROLL TO ADVANCE ↓</span>
  </div>
 </div>
}
