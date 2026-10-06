'use client';
import {useEffect,useRef,useState,type CSSProperties,type KeyboardEvent} from 'react';
import {universeGroups} from './data';
import styles from './CapabilityExplorer.module.css';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Braces,BrainCircuit,Check,Cloud,Code2,Database,Globe,Layers,Link2,Rocket,Server,ShieldCheck,WandSparkles,Workflow} from 'lucide-react';
import {siJavascript,siTypescript,siHtml5,siCss,siReact,siNextdotjs,siNodedotjs,siGit,siGithub,siVercel,type SimpleIcon} from 'simple-icons';
const brandIcons:Record<string,SimpleIcon>={'JavaScript':siJavascript,'TypeScript':siTypescript,'HTML':siHtml5,'CSS':siCss,'React':siReact,'Next.js':siNextdotjs,'Node.js':siNodedotjs,'Git':siGit,'GitHub':siGithub,'Vercel':siVercel};
function SkillIcon({name}:{name:string}){const brand=brandIcons[name];if(brand)return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{color:['Next.js','GitHub','Vercel'].includes(name)?'#f5f6fa':`#${brand.hex}`}}><path fill="currentColor" d={brand.path}/></svg>;const Icon=/AI|LLM/.test(name)?BrainCircuit:/Data|SQL/.test(name)?Database:/API|Integration|Webhooks|Cross-chain|Circle/.test(name)?Link2:/Authentication/.test(name)?ShieldCheck:/Cloud|Deployment|Delivery/.test(name)?Cloud:/Automation|Flow/.test(name)?Workflow:/Web3|Websites|Search/.test(name)?Globe:/Testing|Debugging/.test(name)?Braces:/Prototyping|MVP|SaaS/.test(name)?Rocket:/UI|Interface|Component/.test(name)?Layers:/Tooling/.test(name)?WandSparkles:Code2;return <Icon size={18} strokeWidth={1.8} aria-hidden="true"/>;}
const categoryIcons=[Code2,Server,BrainCircuit,Rocket];

// References: Uiverse glass/gradient cards; React Bits Spotlight Card and Magic Bento;
// Brittany Chiang's compact technology tags. Original implementation, no Pro source.
const categories=[
 {short:'Interface',label:'Design the experience.',description:'From the first interaction to the last pixel.',color:'#7ef5ce',symbol:'</>'},
 {short:'Backend',label:'Connect the system.',description:'Application logic, integrations and dependable data.',color:'#8cbaff',symbol:'{ }'},
 {short:'AI & Web3',label:'Extend what’s possible.',description:'Intelligent workflows and connected onchain products.',color:'#c3a4ff',symbol:'✳'},
 {short:'Delivery',label:'Build. Refine. Ship.',description:'From an early concept to a deployed product.',color:'#f2c98c',symbol:'↗'},
];
export default function CapabilityExplorer({selected,onSelect}:{selected:string;onSelect:(name:string)=>void}){
 const [active,setActive]=useState(0);
 const scene=useRef<HTMLDivElement>(null),card=useRef<HTMLElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  const outer=scene.current,inner=card.current;if(!outer||!inner)return;
  let frame=0,travel=1,visible=false;
  const measure=()=>{const height=inner.offsetHeight;travel=Math.max(320,window.innerHeight*.65)*3;outer.style.setProperty('--scene-height',`${height+travel}px`);outer.style.setProperty('--pin-top',`${Math.min(20,window.innerHeight-height-20)}px`);schedule()};
  const update=()=>{frame=0;if(!visible)return;const pin=parseFloat(outer.style.getPropertyValue('--pin-top'))||0;const distance=pin-outer.getBoundingClientRect().top;const value=Math.max(0,Math.min(1,distance/travel));setProgress(value);if(distance>=0&&distance<=travel)setActive(Math.min(3,Math.floor(value*4)));};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule()});observer.observe(outer);
  const resize=new ResizeObserver(measure);resize.observe(inner);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);measure();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure)};
 },[]);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const start=useRef<number|null>(null);
 const category=categories[active];
 const change=(index:number)=>setActive((index+categories.length)%categories.length);
 const navigate=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  let next=index;
  if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%4;
  else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+3)%4;
  else if(event.key==='Home')next=0;else if(event.key==='End')next=3;else return;
  event.preventDefault();change(next);tabs.current[next]?.focus();
 };
 return <div ref={scene} className={styles.scrollScene}><section ref={card} className={styles.explorer} aria-labelledby="capabilities-title" style={{'--accent':category.color,'--progress':progress} as CSSProperties}>
  <header className={styles.header}>
   <div><span className={styles.eyebrow}>THE FULL STACK / 04 DISCIPLINES</span><h3 id="capabilities-title">One toolkit.<br/><span>Endless possibilities.</span></h3></div>
   <div className={styles.total}><strong>47</strong><span>VERIFIED<br/>CAPABILITIES</span></div>
  </header>
  <div className={styles.workspace}>
   <div className={styles.rail} role="tablist" aria-label="Capability categories">
    {categories.map((item,index)=><button ref={el=>{tabs.current[index]=el}} key={item.short} type="button" role="tab" aria-selected={active===index} aria-controls={`capability-panel-${index}`} id={`capability-tab-${index}`} tabIndex={active===index?0:-1} className={`${styles.tab} ${active===index?styles.active:''}`} onClick={()=>change(index)} onKeyDown={e=>navigate(e,index)}><span className={styles.tabNumber}>{(()=>{const Icon=categoryIcons[index];return <Icon size={18} strokeWidth={1.6} aria-hidden="true"/>})()}</span><span>{item.short}<small>{universeGroups[index].items.length} capabilities</small></span><span className={styles.tabArrow} aria-hidden="true"><ArrowUpRight size={17}/></span></button>)}
    <div className={styles.railFooter}><span className={styles.statusDot}/><span>ONE CONNECTED SYSTEM</span></div>
   </div>
   <div key={active} className={styles.panel} onPointerLeave={e=>{e.currentTarget.style.setProperty('--tilt-x','0deg');e.currentTarget.style.setProperty('--tilt-y','0deg')}} onTouchStart={e=>{start.current=e.touches[0].clientX}} onTouchEnd={e=>{if(start.current===null)return;const delta=e.changedTouches[0].clientX-start.current;if(Math.abs(delta)>65)change(active+(delta<0?1:-1));start.current=null}} onTouchCancel={()=>{start.current=null}} onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--spot-x',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--spot-y',`${e.clientY-r.top}px`);e.currentTarget.style.setProperty('--tilt-x',`${-((e.clientY-r.top)/r.height-.5)*3}deg`);e.currentTarget.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*3}deg`)}}>
    {universeGroups.map((entry,index)=><div key={entry.name} id={`capability-panel-${index}`} role="tabpanel" aria-labelledby={`capability-tab-${index}`} hidden={active!==index} tabIndex={0} className={styles.panelContent}>
     <div className={styles.panelTop}><span className={styles.eyebrow}>DISCIPLINE / 0{index+1}</span><span className={styles.panelCount}>{entry.items.length} SKILLS</span></div>
     <div className={styles.intro}><div><h4>{entry.name}</h4><p>{categories[index].description}</p></div><div className={styles.stack} aria-hidden="true"><i/><i/><i/><span>{(()=>{const Icon=categoryIcons[index];return <Icon size={27} strokeWidth={1.5}/>})()}</span></div></div>
     <div className={styles.skills}>{entry.items.map((name,skillIndex)=><button type="button" key={name} aria-pressed={selected===name} onClick={()=>onSelect(name)} className={`${styles.skill} ${selected===name?styles.chosen:''}`} style={{'--order':skillIndex} as CSSProperties}><span className={styles.skillMark} aria-hidden="true"><SkillIcon name={name}/></span>{name}{selected===name?<Check className={styles.selectedCheck} size={12} aria-hidden="true"/>:null}</button>)}</div>
    </div>)}
    <footer className={styles.footer}><span>{category.label}</span><div className={styles.navigation}><span>0{active+1}<span className={styles.separator}> / 04</span></span><button type="button" aria-label="Previous capability category" onClick={()=>change(active-1)}><ArrowLeft size={17} aria-hidden="true"/></button><button type="button" aria-label="Next capability category" onClick={()=>change(active+1)}><ArrowRight size={17} aria-hidden="true"/></button></div></footer>
   </div>
  </div>
  <div className={styles.bottom}><span className={styles.scrollHint}><ArrowDown size={13} aria-hidden="true"/> SCROLL TO EXPLORE THE STACK</span><span className={styles.focus}>FOCUS <b>{selected}</b></span></div>
 <div className={styles.scrollProgress} aria-hidden="true"/></section></div>;
}
