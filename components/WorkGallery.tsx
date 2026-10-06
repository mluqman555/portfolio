'use client';
import Link from 'next/link';
import {useEffect,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {projectEntries} from './projectEntries';
import ProjectEnergyPanel from './ProjectEnergyPanel';
const accents=['var(--accent-purple)','var(--accent-green)','var(--accent-blue)','var(--accent-cyan)','var(--accent-lavender)','var(--metal-silver)','var(--accent-mint)','var(--accent-emerald)','var(--accent-periwinkle)','var(--metal-bright)'];
export default function WorkGallery(){
 const root=useRef<HTMLElement>(null),rail=useRef<HTMLDivElement>(null),activeIndex=useRef(0),holdUntil=useRef(0);const [active,setActive]=useState(0);
 const go=(index:number)=>{const el=rail.current;if(!el)return;holdUntil.current=Date.now()+18000;const next=(index+projectEntries.length)%projectEntries.length;el.scrollTo({left:(el.children[next] as HTMLElement).getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};

 useEffect(()=>{
 const host=root.current,track=rail.current;if(!host||!track)return;const cards=Array.from(track.querySelectorAll<HTMLElement>('.vault-slot'));let frame=0,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const measure=()=>{frame=0;const bounds=track.getBoundingClientRect();let nearest=0,distance=Infinity;cards.forEach((card,i)=>{const r=card.getBoundingClientRect(),d=Math.abs(r.left-bounds.left);if(d<distance){distance=d;nearest=i}const depth=Math.max(-1,Math.min(1,(r.left+r.width/2-bounds.left-bounds.width/2)/bounds.width));card.style.setProperty('--rail-turn',reduced.matches?'0deg':`${-depth*9}deg`);card.style.setProperty('--rail-depth',reduced.matches?'0px':`${-Math.abs(depth)*32}px`);card.dataset.entered='true';card.dataset.energyActive=String(visible&&r.right>bounds.left&&r.left<bounds.right&&!document.hidden)});activeIndex.current=nearest;setActive(nearest)};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};
 const hold=()=>{holdUntil.current=Date.now()+18000};
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule()});io.observe(host);
 const resize=new ResizeObserver(schedule);resize.observe(track);
 const timer=setInterval(()=>{if(!visible||document.hidden||reduced.matches||Date.now()<holdUntil.current||track.contains(document.activeElement))return;const next=(activeIndex.current+1)%cards.length;track.scrollTo({left:cards[next].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft,behavior:next===0?'auto':'smooth'})},6500);
 track.addEventListener('scroll',schedule,{passive:true});track.addEventListener('pointerdown',hold,{passive:true});track.addEventListener('pointerenter',hold);track.addEventListener('focusin',hold);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);schedule();
 return()=>{clearInterval(timer);cancelAnimationFrame(frame);io.disconnect();resize.disconnect();track.removeEventListener('scroll',schedule);track.removeEventListener('pointerdown',hold);track.removeEventListener('pointerenter',hold);track.removeEventListener('focusin',hold);document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule)};
 },[]);
 const move=(e:PointerEvent<HTMLElement>)=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=e.currentTarget,r=el.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));el.style.setProperty('--rx',`${-y*5}deg`);el.style.setProperty('--ry',`${x*5}deg`);el.style.setProperty('--mx',`${x*4}px`);el.style.setProperty('--my',`${y*4}px`);el.style.setProperty('--light-x',`${(x+1)*50}%`);el.style.setProperty('--light-y',`${(y+1)*50}%`);};
 const reset=(e:PointerEvent<HTMLElement>)=>{const el=e.currentTarget;['--rx','--ry','--mx','--my','--light-x','--light-y'].forEach(p=>el.style.removeProperty(p));};
 return <section ref={root} className="work section project-vault" id="work">
 <div className="section-label"><span className="section-index">03</span><h2 className="work-title">MY WORK</h2><span className="label-line"/></div>
 <div className="section-heading"><h3 className="work-subtitle">Ideas made<br/><span>operational.</span></h3><p>Completed work. Current development.<br/>One connected project collection.</p></div>

 <div className="project-rail-controls"><span className="mono">PROJECT {String(active+1).padStart(2,'0')} / {String(projectEntries.length).padStart(2,'0')} · SWIPE TO EXPLORE</span><div><button type="button" onClick={()=>go(active-1)} aria-label="Previous project">←</button><button type="button" onClick={()=>go(active+1)} aria-label="Next project">→</button></div></div><div className="vault-grid project-rail" ref={rail} role="region" aria-roledescription="carousel" aria-label="Project cards" tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1))}}}>{projectEntries.map((p,i)=><div className="vault-slot" key={p.name} id={`work-project-${i+1}`} style={{'--card-accent':accents[i]} as CSSProperties}>
 <article className="vault-card" aria-labelledby={`project-title-${i}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
 <div className="vault-media"><ProjectEnergyPanel index={i}/></div>
 <div className="vault-content"><div className="vault-meta"><strong>PROJECT / {String(i+1).padStart(2,'0')}</strong><span>{p.status}</span></div><p className="vault-category">{p.category}</p><h3 id={`project-title-${i}`}>{p.name}</h3><p className="vault-description">{p.description}</p><div className="vault-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
 <div className="vault-links">{p.live&&<a href={p.live} target="_blank" rel="noreferrer">{p.name==='Xroga'?'EXPLORE XROGA':'VIEW LIVE'} <span>↗</span></a>}{p.repo&&<a href={p.repo} target="_blank" rel="noreferrer">VIEW CODE <span>↗</span></a>}{p.slug&&<Link href={`/work/${p.slug}`}>READ CASE STUDY <span>→</span></Link>}</div>
 {p.status==='REFERENCE PROJECT'&&<small>External open-source reference. Original ownership retained in the linked repository.</small>}</div>
 </article></div>)}</div></section>;
}
