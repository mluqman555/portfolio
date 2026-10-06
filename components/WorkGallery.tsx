'use client';
import Link from 'next/link';
import {useEffect,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {projectEntries} from './projectEntries';
import ProjectCardVisual from './ProjectCardVisual';
const accents=['#8acfff','#93e9bf','#c0a2ff','#7fe0e8','#edbc7d','#f0a49e','#bbb4f4','#a1d8ba','#ead8ad','#8baeff'];
export default function WorkGallery(){
 const root=useRef<HTMLElement>(null);const [active,setActive]=useState(0);
 useEffect(()=>{const host=root.current;if(!host)return;const cards=Array.from(host.querySelectorAll<HTMLElement>('.vault-slot'));let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const measure=()=>{frame=0;let closest=Infinity,index=0;const distances:number[]=[];cards.forEach((card,i)=>{const r=card.getBoundingClientRect(),d=Math.abs(r.top+r.height*.5-innerHeight*.5);distances[i]=d;if(d<closest){closest=d;index=i}const depth=reduced.matches?0:Math.min(1,d/innerHeight);card.style.setProperty('--scroll-depth',String(depth));});setActive(previous=>distances[previous]<=closest+48?previous:index)};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};
 const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){(e.target as HTMLElement).dataset.entered='true';io.unobserve(e.target)}})},{threshold:.08});cards.forEach(c=>io.observe(c));schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
 return()=>{cancelAnimationFrame(frame);io.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[]);
 const move=(e:PointerEvent<HTMLElement>)=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=e.currentTarget,r=el.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));el.style.setProperty('--rx',`${-y*5}deg`);el.style.setProperty('--ry',`${x*5}deg`);el.style.setProperty('--mx',`${x*4}px`);el.style.setProperty('--my',`${y*4}px`);el.style.setProperty('--light-x',`${(x+1)*50}%`);el.style.setProperty('--light-y',`${(y+1)*50}%`);};
 const reset=(e:PointerEvent<HTMLElement>)=>{const el=e.currentTarget;['--rx','--ry','--mx','--my','--light-x','--light-y'].forEach(p=>el.style.removeProperty(p));};
 return <section ref={root} className="work section project-vault" id="work">
 <div className="section-label"><span className="section-index">01</span><strong>MY WORK / PROJECT INDEX</strong><span className="label-line"/></div>
 <div className="section-heading"><h2>Ideas made<br/><span>operational.</span></h2><p>Completed work. Current development.<br/>One connected project collection.</p></div>
 <nav className="vault-index" aria-label="Project index">{projectEntries.map((p,i)=><button key={p.name} type="button" aria-label={`Project ${String(i+1).padStart(2,'0')}: ${p.name}`} aria-current={active===i?'true':undefined} onClick={()=>{document.getElementById(`work-project-${i+1}`)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});setActive(i)}}><span>{String(i+1).padStart(2,'0')}</span><span className="vault-index-name">{p.name}</span></button>)}</nav>
 <div className="vault-grid">{projectEntries.map((p,i)=><div className="vault-slot" key={p.name} id={`work-project-${i+1}`} style={{'--card-accent':accents[i]} as CSSProperties}>
 <article className="vault-card" aria-labelledby={`project-title-${i}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
 <div className="vault-media">{p.image?<img src={p.image} alt={`${p.name} project visual`} loading="lazy" decoding="async"/>:<ProjectCardVisual index={i}/>}<span className="vault-media-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span></div>
 <div className="vault-content"><div className="vault-meta"><strong>PROJECT / {String(i+1).padStart(2,'0')}</strong><span>{p.status}</span></div><p className="vault-category">{p.category}</p><h3 id={`project-title-${i}`}>{p.name}</h3><p className="vault-description">{p.description}</p><div className="vault-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
 <div className="vault-links">{p.live&&<a href={p.live} target="_blank" rel="noreferrer">{p.name==='Xroga'?'EXPLORE XROGA':'VIEW LIVE'} <span>↗</span></a>}{p.repo&&<a href={p.repo} target="_blank" rel="noreferrer">VIEW CODE <span>↗</span></a>}{p.slug&&<Link href={`/work/${p.slug}`}>READ CASE STUDY <span>→</span></Link>}</div>
 {p.status==='REFERENCE PROJECT'&&<small>External open-source reference. Original ownership retained in the linked repository.</small>}</div>
 </article></div>)}</div></section>;
}
