'use client';
import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {universeGroups} from './data';
const orbit=universeGroups.flatMap((g,band)=>g.items.slice(0,6).map((name,slot)=>({name,band,slot})));
const colours=[[.2,1,.6,.42],[.2,.58,1,.46],[.63,.44,1,.42],[.8,.84,.9,.3]];
export default function Universe(){
 const host=useRef<HTMLDivElement>(null),webgl=useRef<HTMLCanvasElement>(null),flat=useRef<HTMLCanvasElement>(null),buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const [selected,setSelected]=useState<string>('React'),[fallback,setFallback]=useState(false);
 const catalog=useRef<HTMLDivElement>(null),slideIndex=useRef(0),holdUntil=useRef(0);const [slide,setSlide]=useState(0);
 const focused=useRef(false),selection=useRef('React');useEffect(()=>{selection.current=selected},[selected]);
 useEffect(()=>{
  const el=host.current,canvas=fallback?flat.current:webgl.current;if(!el||!canvas)return;
  const gl=fallback?null:canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
  const ctx=fallback?canvas.getContext('2d'):null;
  let program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null,vs:WebGLShader|null=null,fs:WebGLShader|null=null;
  let position=-1,ratio:WebGLUniformLocation|null=null,colour:WebGLUniformLocation|null=null,point:WebGLUniformLocation|null=null;
  if(!fallback&&!gl){setFallback(true);return}if(fallback&&!ctx)return;
  if(gl){
   const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);return s};
   vs=shader(gl.VERTEX_SHADER,'attribute vec3 position;uniform float ratio;uniform float pointSize;void main(){float d=3.5/(3.5-position.z*.28);gl_Position=vec4(position.x*d/ratio,position.y*d,0.0,1.0);gl_PointSize=pointSize;}');
   fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;uniform vec4 color;void main(){gl_FragColor=color;}');
   program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);setFallback(true);return}
   gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
   ratio=gl.getUniformLocation(program,'ratio');colour=gl.getUniformLocation(program,'color');point=gl.getUniformLocation(program,'pointSize');gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  }
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let width=0,height=0,frame=0,previous=0,angle=.18,visible=false;let sizes:number[][]=[];
  const transform=(x:number,y:number,band:number):[number,number,number]=>{const tilt=.31+band*.05;return [x,y*Math.cos(tilt),y*Math.sin(tilt)]};
  const project=([x,y,z]:[number,number,number])=>{const d=3.5/(3.5-z*.28);return [width/2+x*d*height/2,height/2-y*d*height/2]};
  const draw=(verts:number[],rgba:number[],loop:boolean)=>{
   if(gl){gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.DYNAMIC_DRAW);gl.uniform4fv(colour,rgba);gl.uniform1f(point,3);gl.drawArrays(loop?gl.LINE_STRIP:gl.POINTS,0,verts.length/3)}
   else if(ctx){ctx.strokeStyle=ctx.fillStyle=`rgba(${rgba.slice(0,3).map(n=>Math.round(n*255)).join(',')},${rgba[3]})`;if(loop){ctx.beginPath();for(let j=0;j<verts.length;j+=3){const [x,y]=project([verts[j],verts[j+1],verts[j+2]]);if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}else{for(let j=0;j<verts.length;j+=3){const [x,y]=project([verts[j],verts[j+1],verts[j+2]]);ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill()}}}
  };
  const render=(now:number)=>{
   frame=0;if(!visible||document.hidden)return;const dt=previous?Math.min(now-previous,50):16;previous=now;if(!preference.matches)angle+=dt*.000034*(focused.current ? .16 : 1);
   if(gl){gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(ratio,width/height)}else ctx?.clearRect(0,0,width,height);
   const mobile=width<700,scale=Math.min(1,width/height*.92),radii=[.37,.59,.80,1.02];const labels:Array<{x:number;y:number;dy:number;z:number}>=[];
   for(let band=0;band<4;band++){const ring:number[]=[];for(let j=0;j<=120;j++){const a=j/120*Math.PI*2;ring.push(...transform(Math.cos(a)*radii[band]*scale,Math.sin(a)*radii[band]*scale,band))}draw(ring,colours[band],true)}
   orbit.forEach((node,i)=>{const a=angle*(1-node.band*.16)*(node.band%2?-1:1)+node.slot*Math.PI/3+node.band*Math.PI/6,r=radii[node.band]*scale,p=transform(Math.cos(a)*r,Math.sin(a)*r,node.band),[x,y]=project(p);labels.push({x,y,dy:0,z:p[2]});draw(p,node.name===selection.current?[.2,1,.6,1]:colours[node.band],false)});
   if(!mobile){for(let pass=0;pass<4;pass++){for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=labels[i],b=labels[j],dx=Math.abs(a.x-b.x),dy=a.y+a.dy-b.y-b.dy,required=((sizes[i]?.[1]||36)+(sizes[j]?.[1]||36))/2+8;if(dx<((sizes[i]?.[0]||110)+(sizes[j]?.[0]||110))/2+10&&Math.abs(dy)<required){const push=(required-Math.abs(dy))/2,sign=dy===0?(i%2?1:-1):Math.sign(dy);a.dy=Math.max(-48,Math.min(48,a.dy+sign*push));b.dy=Math.max(-48,Math.min(48,b.dy-sign*push))}}}
   labels.forEach((p,i)=>{const button=buttons.current[i];if(button){button.style.transform=`translate3d(${p.x}px,${p.y+p.dy}px,0) translate(-50%,-50%)`;button.style.zIndex=p.z>0?'4':'2';button.style.setProperty('--orbit-depth',String(p.z>0?1:.7))}})}
   if(!preference.matches)frame=requestAnimationFrame(render);
  };
  const stop=()=>{cancelAnimationFrame(frame);frame=0;previous=0};const schedule=()=>{if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(render)};
  const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,width<700?1:1.5);canvas.width=width*dpr;canvas.height=height*dpr;sizes=buttons.current.map(button=>[button?.offsetWidth||110,button?.offsetHeight||36]);if(gl)gl.viewport(0,0,canvas.width,canvas.height);else ctx?.setTransform(dpr,0,0,dpr,0,0);schedule()};
  const visibility=()=>{if(document.hidden)stop();else schedule()};
  const change=()=>{stop();schedule()};
  const ro=new ResizeObserver(resize);ro.observe(el);const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule();else stop()});io.observe(el);
  const lost=(e:Event)=>{e.preventDefault();setFallback(true)};canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);preference.addEventListener('change',change);resize();
  return()=>{stop();ro.disconnect();io.disconnect();canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',change);if(gl){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}};
 },[fallback]);

 const showSlide=(index:number)=>{const el=catalog.current;if(!el)return;holdUntil.current=Date.now()+18000;const next=(index+universeGroups.length)%universeGroups.length;el.scrollTo({left:(el.children[next] as HTMLElement).getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 useEffect(()=>{const el=catalog.current;if(!el)return;let visible=false;const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{const index=Math.max(0,Math.min(universeGroups.length-1,Math.round(el.scrollLeft/el.clientWidth)));slideIndex.current=index;setSlide(index)};
 const hold=()=>{holdUntil.current=Date.now()+18000};
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting});io.observe(el);
 const timer=setInterval(()=>{if(!visible||document.hidden||preference.matches||Date.now()<holdUntil.current||el.contains(document.activeElement))return;const next=(slideIndex.current+1)%universeGroups.length;el.scrollTo({left:(el.children[next] as HTMLElement).getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft,behavior:next===0?'auto':'smooth'})},7000);
 const resized=new ResizeObserver(()=>{el.scrollTo({left:(el.children[slideIndex.current] as HTMLElement).getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft,behavior:'auto'})});resized.observe(el);
 el.addEventListener('scroll',sync,{passive:true});el.addEventListener('pointerdown',hold,{passive:true});el.addEventListener('pointerenter',hold);el.addEventListener('focusin',hold);
 return()=>{clearInterval(timer);io.disconnect();resized.disconnect();el.removeEventListener('scroll',sync);el.removeEventListener('pointerdown',hold);el.removeEventListener('pointerenter',hold);el.removeEventListener('focusin',hold)}},[]);

 const select=(name:string)=>{selection.current=name;setSelected(name)};
 const move=(e:PointerEvent<HTMLDivElement>)=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--universe-x',`${((e.clientX-r.left)/r.width-.5)*2}deg`);e.currentTarget.style.setProperty('--universe-y',`${-((e.clientY-r.top)/r.height-.5)*2}deg`)};
 return <div className="expanded-universe"><div className={`universe-stage expanded-universe-stage ${fallback?'universe-fallback':''}`} ref={host} onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.setProperty('--universe-x','0deg');e.currentTarget.style.setProperty('--universe-y','0deg')}}><canvas ref={webgl} aria-hidden="true"/><canvas ref={flat} className="universe-fallback-canvas" aria-hidden="true"/><div className="universe-centre"><span className="mono">ONE CONNECTED SYSTEM</span><strong>FULL<br/>STACK<span>_</span></strong><small>MUHAMMAD LUQMAN</small></div><div className="universe-planets">{orbit.map((node,i)=><button key={node.name} ref={node=>{buttons.current[i]=node}} className={`planet ${selected===node.name?'selected':''}`} aria-pressed={selected===node.name} onFocus={()=>{focused.current=true;select(node.name)}} onBlur={()=>{focused.current=false}} onPointerEnter={()=>{focused.current=true;select(node.name)}} onPointerLeave={()=>{focused.current=false}} onClick={()=>select(node.name)}>{node.name}</button>)}</div></div><div className="universe-selection mono" aria-live="polite"><span>FOCUS / {selected}</span><span>FOUR ORBITS · ONE FULL STACK</span></div><section className="universe-catalog" aria-labelledby="capabilities-title"><h3 id="capabilities-title" className="universe-catalog-title">EXPLORE ALL {universeGroups.reduce((n,g)=>n+g.items.length,0)} VERIFIED CAPABILITIES</h3><div className="capability-slide-controls"><span className="mono">SLIDE {String(slide+1).padStart(2,'0')} / 04</span><div><button type="button" onClick={()=>showSlide(slide-1)} aria-label="Previous capability slide">←</button><button type="button" onClick={()=>showSlide(slide+1)} aria-label="Next capability slide">→</button></div></div><div className="universe-catalog-grid capability-slides" ref={catalog} role="region" aria-roledescription="carousel" aria-label="All 47 capabilities" tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showSlide(slide+(e.key==='ArrowRight'?1:-1))}}}>{universeGroups.map((g,i)=><div key={g.name} className={`capability-group capability-group-${i}`} role="group" aria-roledescription="slide" aria-label={`${i+1} of 4: ${g.name}`}><h3>{g.name}</h3><div>{g.items.map(name=><button key={name} aria-pressed={selected===name} onClick={()=>select(name)}>{name}</button>)}</div></div>)}</div></section></div>
}
