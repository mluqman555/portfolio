'use client';
import {useEffect,useRef,useState} from 'react';
import {architectureLayers} from './data';
export default function ArchitectureFlow(){
 const root=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);
 useEffect(()=>{const el=root.current;if(!el)return;const nodes=Array.from(el.querySelectorAll<HTMLElement>('.architecture-node'));let frame=0,visible=false;
 const measure=()=>{frame=0;if(!visible||document.hidden)return;let best=0,dist=Infinity;nodes.forEach((node,i)=>{const r=node.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-innerHeight*.54);if(d<dist){best=i;dist=d}});setActive(best)};
 const schedule=()=>{el.dataset.motionActive=String(visible&&!document.hidden);if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(measure)};
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule()});io.observe(el);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);return()=>{io.disconnect();cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule)}},[]);
 return <div className="architecture-flow" ref={root} data-active-layer={active}><div className="architecture-anchor"><span className="mono">ONE CONNECTED PRODUCT</span><strong>FULL STACK DEV</strong><span className="architecture-domain">lukman.dev</span><div className="architecture-route" aria-hidden="true"><i/><i/><i/></div></div><div className="architecture-layers">{architectureLayers.map(([title,copy],i)=><article className="architecture-node" key={title} data-active={active===i} tabIndex={0} onFocus={()=>setActive(i)} onPointerEnter={()=>setActive(i)} aria-current={active===i?'step':undefined}><span className="mono">LAYER / {String(i+1).padStart(2,'0')}<i aria-hidden="true"/></span><h3>{title}</h3><p>{copy}</p><span className="architecture-handoff" aria-hidden="true"/></article>)}</div></div>
}
