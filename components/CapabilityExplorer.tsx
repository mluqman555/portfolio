'use client';
import {useRef,useState,type CSSProperties,type KeyboardEvent} from 'react';
import {universeGroups} from './data';
import styles from './CapabilityExplorer.module.css';

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
 return <section className={styles.explorer} aria-labelledby="capabilities-title" style={{'--accent':category.color} as CSSProperties}>
  <header className={styles.header}>
   <div><span className={styles.eyebrow}>THE FULL STACK / 04 DISCIPLINES</span><h3 id="capabilities-title">One toolkit.<br/><span>Endless possibilities.</span></h3></div>
   <div className={styles.total}><strong>47</strong><span>VERIFIED<br/>CAPABILITIES</span></div>
  </header>
  <div className={styles.workspace}>
   <div className={styles.rail} role="tablist" aria-label="Capability categories">
    {categories.map((item,index)=><button ref={el=>{tabs.current[index]=el}} key={item.short} type="button" role="tab" aria-selected={active===index} aria-controls={`capability-panel-${index}`} id={`capability-tab-${index}`} tabIndex={active===index?0:-1} className={`${styles.tab} ${active===index?styles.active:''}`} onClick={()=>change(index)} onKeyDown={e=>navigate(e,index)}><span className={styles.tabNumber}>0{index+1}</span><span>{item.short}<small>{universeGroups[index].items.length} capabilities</small></span><span className={styles.tabArrow} aria-hidden="true">↗</span></button>)}
    <div className={styles.railFooter}><span className={styles.statusDot}/><span>ONE CONNECTED SYSTEM</span></div>
   </div>
   <div className={styles.panel} onTouchStart={e=>{start.current=e.touches[0].clientX}} onTouchEnd={e=>{if(start.current===null)return;const delta=e.changedTouches[0].clientX-start.current;if(Math.abs(delta)>65)change(active+(delta<0?1:-1));start.current=null}} onTouchCancel={()=>{start.current=null}} onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--spot-x',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--spot-y',`${e.clientY-r.top}px`)}}>
    {universeGroups.map((entry,index)=><div key={entry.name} id={`capability-panel-${index}`} role="tabpanel" aria-labelledby={`capability-tab-${index}`} hidden={active!==index} tabIndex={0} className={styles.panelContent}>
     <div className={styles.panelTop}><span className={styles.eyebrow}>DISCIPLINE / 0{index+1}</span><span className={styles.panelCount}>{entry.items.length} SKILLS</span></div>
     <div className={styles.intro}><div><h4>{entry.name}</h4><p>{categories[index].description}</p></div><div className={styles.stack} aria-hidden="true"><i/><i/><i/><span>{categories[index].symbol}</span></div></div>
     <div className={styles.skills}>{entry.items.map((name,skillIndex)=><button type="button" key={name} aria-pressed={selected===name} onClick={()=>onSelect(name)} className={`${styles.skill} ${selected===name?styles.chosen:''}`} style={{'--order':skillIndex} as CSSProperties}><span className={styles.skillMark} aria-hidden="true">{selected===name?'✓':'+'}</span>{name}</button>)}</div>
    </div>)}
    <footer className={styles.footer}><span>{category.label}</span><div className={styles.navigation}><span>0{active+1}<span className={styles.separator}> / 04</span></span><button type="button" aria-label="Previous capability category" onClick={()=>change(active-1)}>←</button><button type="button" aria-label="Next capability category" onClick={()=>change(active+1)}>→</button></div></footer>
   </div>
  </div>
  <div className={styles.bottom}><span>SELECT A SKILL TO EXPLORE THE STACK</span><span className={styles.focus}>FOCUS <b>{selected}</b></span></div>
 </section>;
}
