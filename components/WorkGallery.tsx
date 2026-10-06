'use client';
import Link from 'next/link';
import {useEffect,useRef,type CSSProperties,type PointerEvent} from 'react';
import {projectEntries} from './projectEntries';
import ProjectEnergyPanel from './ProjectEnergyPanel';
const accents=['var(--accent-purple)','var(--accent-green)','var(--accent-blue)','var(--accent-cyan)','var(--accent-lavender)','var(--metal-silver)','var(--accent-mint)','var(--accent-emerald)','var(--accent-periwinkle)','var(--metal-bright)'];
export default function WorkGallery(){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{const host=root.current;if(!host)return;const cards=Array.from(host.querySelectorAll<HTMLElement>('.vault-slot'));let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const measure=()=>{frame=0;cards.forEach(card=>{const r=card.getBoundingClientRect(),d=Math.abs(r.top+r.height*.5-innerHeight*.5);card.style.setProperty('--scroll-depth',String(reduced.matches?0:Math.min(1,d/innerHeight)))})};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};
 const motionObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{(e.target as HTMLElement).dataset.energyActive=String(e.isIntersecting)})},{rootMargin:'100px'});cards.forEach(c=>motionObserver.observe(c));
 const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){(e.target as HTMLElement).dataset.entered='true';io.unobserve(e.target)}})},{threshold:.08});cards.forEach(c=>io.observe(c));schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
 return()=>{cancelAnimationFrame(frame);io.disconnect();motionObserver.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[]);
 const move=(e:PointerEvent<HTMLElement>)=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=e.currentTarget,r=el.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));el.style.setProperty('--rx',`${-y*5}deg`);el.style.setProperty('--ry',`${x*5}deg`);el.style.setProperty('--mx',`${x*4}px`);el.style.setProperty('--my',`${y*4}px`);el.style.setProperty('--light-x',`${(x+1)*50}%`);el.style.setProperty('--light-y',`${(y+1)*50}%`);};
 const reset=(e:PointerEvent<HTMLElement>)=>{const el=e.currentTarget;['--rx','--ry','--mx','--my','--light-x','--light-y'].forEach(p=>el.style.removeProperty(p));};
 return <section ref={root} className="work section project-vault" id="work">
 <div className="section-label"><span className="section-index">01</span><h2 className="work-title">MY WORK</h2><span className="label-line"/></div>
 <div className="section-heading"><h3 className="work-subtitle">Ideas made<br/><span>operational.</span></h3><p>Completed work. Current development.<br/>One connected project collection.</p></div>

 <div className="vault-grid">{projectEntries.map((p,i)=><div className="vault-slot" key={p.name} id={`work-project-${i+1}`} style={{'--card-accent':accents[i]} as CSSProperties}>
 <article className="vault-card" aria-labelledby={`project-title-${i}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
 <div className="vault-media"><ProjectEnergyPanel index={i}/></div>
 <div className="vault-content"><div className="vault-meta"><strong>PROJECT / {String(i+1).padStart(2,'0')}</strong><span>{p.status}</span></div><p className="vault-category">{p.category}</p><h3 id={`project-title-${i}`}>{p.name}</h3><p className="vault-description">{p.description}</p><div className="vault-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
 <div className="vault-links">{p.live&&<a href={p.live} target="_blank" rel="noreferrer">{p.name==='Xroga'?'EXPLORE XROGA':'VIEW LIVE'} <span>↗</span></a>}{p.repo&&<a href={p.repo} target="_blank" rel="noreferrer">VIEW CODE <span>↗</span></a>}{p.slug&&<Link href={`/work/${p.slug}`}>READ CASE STUDY <span>→</span></Link>}</div>
 {p.status==='REFERENCE PROJECT'&&<small>External open-source reference. Original ownership retained in the linked repository.</small>}</div>
 </article></div>)}</div></section>;
}
