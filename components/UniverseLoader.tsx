'use client';
import dynamic from 'next/dynamic';
import {useEffect,useRef,useState} from 'react';
const Universe=dynamic(()=>import('./Universe'),{ssr:false,loading:()=> <div className="universe-loading"><span className="mono">INITIALISING DEVELOPMENT UNIVERSE…</span><div className="loading-orbit">FULL STACK</div></div>});
export default function UniverseLoader(){const ref=useRef<HTMLDivElement>(null);const [ready,setReady]=useState(false);useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setReady(true);io.disconnect()}},{rootMargin:'500px'});if(ref.current)io.observe(ref.current);return()=>io.disconnect()},[]);return <div ref={ref} className="universe-shell">{ready?<Universe/>:<div className="universe-loading"><div className="loading-orbit">FULL STACK</div><p>React · Next.js · TypeScript · Node.js · Database · APIs · Git · Cloud · AI</p></div>}</div>}
