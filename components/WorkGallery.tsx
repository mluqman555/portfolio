'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, type CSSProperties, type PointerEvent} from 'react';
import {ArrowUpRight, ArrowRight, Code2, Layers, Sparkles} from 'lucide-react';
import {projectEntries, type ProjectEntry} from './projectEntries';
import styles from './WorkGallery.module.css';

const previews: Record<string, {image?: string; accent: string; label: string}> = {
 'Circle Arc Net': {image:'circle-arc',accent:'#bdacff',label:'Live product'},
 'Circle Portfolio Agent': {image:'circle-agent',accent:'#89d9bf',label:'Source preview'},
 Xroga: {accent:'#9bbaff',label:'In development'},
 Meridian: {image:'meridian',accent:'#b4adff',label:'Live reference'},
 Resolve: {image:'resolve',accent:'#a8dfe5',label:'Live reference'},
 RepoDiet: {image:'repodiet',accent:'#83d1f4',label:'Live reference'},
};
const filters = ['All projects','Built & building','Open-source references'] as const;

function ProductCard({project, index}: {project: ProjectEntry; index: number}) {
 const preview=previews[project.name];
 const destination=project.live || project.repo;
 const sourceOnly=preview.label==='Source preview';
 const move=(event:PointerEvent<HTMLElement>)=>{
  if(event.pointerType!=='mouse')return;
  const rect=event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);
  event.currentTarget.style.setProperty('--spot-y',`${event.clientY-rect.top}px`);
 };
 return <article className={`${styles.card} ${index===0?styles.featured:''}`} style={{'--product-accent':preview.accent} as CSSProperties} onPointerMove={move} aria-labelledby={`showcase-${project.name.replaceAll(' ','-')}`}>
  <div className={styles.visual}>
   <div className={styles.visualMeta}><span>{String(projectEntries.indexOf(project)+1).padStart(2,'0')} / PRODUCT</span><span><i/>{preview.label}</span></div>
   <a className={styles.browser} href={destination} target="_blank" rel="noreferrer" aria-label={`${sourceOnly?'View source for':'Explore'} ${project.name}`}>
    <div className={styles.browserBar}><span className={styles.dots}><i/><i/><i/></span><span>{sourceOnly?'github.com/mluqman555/Circle':project.live?new URL(project.live).hostname:'Product preview'}</span><ArrowUpRight size={13} aria-hidden="true"/></div>
    <div className={styles.screen}>
     {preview.image?<Image src={`/projects/showcase/${preview.image}.webp`} alt={`${project.name} ${sourceOnly?'repository documentation':'homepage'} screenshot`} width={1332} height={926} sizes="(max-width: 700px) 90vw, (max-width: 1000px) 85vw, 55vw"/>:<div className={styles.placeholder}><Sparkles size={30} aria-hidden="true"/><strong>Xroga<span>Build what comes next.</span></strong><span>AI APP BUILDER · IN DEVELOPMENT</span><small>Homepage preview coming soon</small></div>}
     <span className={styles.open}>{sourceOnly?'Explore source':'Explore product'}<ArrowUpRight size={18} aria-hidden="true"/></span>
    </div>
   </a>
  </div>
  <div className={styles.content}>
   <div className={styles.eyebrow}>{project.status==='REFERENCE PROJECT'?'OPEN-SOURCE REFERENCE':project.status==='WORK IN PROGRESS'?'CURRENTLY BUILDING':'SELECTED BUILD'}<span>{project.category.split(' / ')[0]}</span></div>
   <h3 id={`showcase-${project.name.replaceAll(' ','-')}`}>{project.name}</h3>
   <p>{project.description}</p>
   <div className={styles.tags}>{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
   <div className={styles.links}>{project.live&&<a href={project.live} target="_blank" rel="noreferrer">Explore product<ArrowUpRight size={17} aria-hidden="true"/></a>}{project.repo&&<a href={project.repo} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true"/>Source</a>}{project.slug&&<Link href={`/work/${project.slug}`}>Case study<ArrowRight size={16} aria-hidden="true"/></Link>}</div>
   {project.status==='REFERENCE PROJECT'&&<small className={styles.attribution}>External project · original creators credited in the source repository.</small>}
  </div>
 </article>;
}

export default function WorkGallery(){
 const [filter,setFilter]=useState<(typeof filters)[number]>('All projects');
 const visible=projectEntries.filter(project=>filter==='All projects'||(filter==='Open-source references'?project.status==='REFERENCE PROJECT':project.status!=='REFERENCE PROJECT'));
 return <section id="work" className={styles.showcase} aria-labelledby="showcase-heading">
  <div className={styles.kicker}><span>03 / SELECTED WORK</span><span><Layers size={14} aria-hidden="true"/>PRODUCT SHOWCASE</span></div>
  <div className={styles.heading}><h2 id="showcase-heading">From idea.<br/><span>To something real.</span></h2><p>A closer look at the products I’ve built,<br/>what I’m building, and open-source references.</p></div>
  <div className={styles.toolbar}><div className={styles.filters} aria-label="Filter projects">{filters.map(option=><button key={option} type="button" aria-pressed={filter===option} onClick={()=>setFilter(option)}>{option}{option===filter&&<span>{String(visible.length).padStart(2,'0')}</span>}</button>)}</div><span className={styles.count}>EXPLORE THE COLLECTION<ArrowUpRight size={15} aria-hidden="true"/></span></div>
  <div className={styles.grid}>{visible.map((project,index)=><ProductCard key={project.name} project={project} index={index}/>)}</div>
  <div className={styles.footer}><span>GOOD IDEAS DESERVE TO BE SHIPPED.</span><a href="#contact">Let’s build yours<ArrowUpRight size={20} aria-hidden="true"/></a></div>
 </section>;
}