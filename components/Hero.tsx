'use client';
import {useEffect,useRef,useState} from 'react';
import HeroFallback from './HeroFallback';
const vertex=`
precision highp float;
attribute vec3 aVertex; attribute vec3 aNormal; attribute vec3 aCore; attribute vec3 aNerve; attribute vec3 aScatter; attribute vec4 aSeed;
uniform float uTime,uProgress,uAspect,uMobile; uniform vec2 uPointer; uniform float uInfluence;
varying mediump vec3 vColor; varying mediump float vLight,vFade;
vec3 rotateY(vec3 p,float a){return vec3(p.x*cos(a)+p.z*sin(a),p.y,-p.x*sin(a)+p.z*cos(a));}
vec3 rotateX(vec3 p,float a){return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a));}
void main(){
 float branch=smoothstep(.05,.35,uProgress); float dissolve=smoothstep(.58,1.,uProgress);
 vec3 p=mix(aCore,aNerve,branch); p=mix(p,aScatter,dissolve*.85);
 p+=vec3(sin(uTime*.3+aSeed.x*15.),cos(uTime*.25+aSeed.x*19.),sin(uTime*.22+aSeed.x*11.))*.025;
 float pressure=pow(max(0.,1.-distance(p.xy,uPointer)/.7),2.)*uInfluence;
 p.xy+=normalize(p.xy-uPointer+vec2(.001))*pressure*.13;
 float scale=aSeed.y*(1.+pressure*2.4)*(1.+sin(uTime*.27+aSeed.x*16.)*.08);
 vec3 local=rotateX(rotateY(aVertex,uTime*(.04+aSeed.x*.07)+aSeed.x*23.),aSeed.x*11.+uTime*.07)*scale;
 vec3 normal=rotateX(rotateY(aNormal,uTime*(.04+aSeed.x*.07)+aSeed.x*23.),aSeed.x*11.+uTime*.07);
 p=rotateY(p,.15+sin(uTime*.1)*.035+uPointer.x*.012);
 float pan=smoothstep(.08,.34,uProgress); p.x+=pan*mix(1.15,.0,uMobile); p.y-=pan*.08;
 p+=local;
 float cam=5.9-.55*sin(uProgress*3.14159); float f=1.0/tan(.32); float z=cam-p.z;
 gl_Position=vec4(p.x*f/uAspect,p.y*f,(z-1.)/(12.-1.)*2.*z-z,z);
 vec3 silver=vec3(.75,.77,.83),violet=vec3(.59,.48,.82),amber=vec3(.77,.49,.21),teal=vec3(.23,.68,.65);
 vColor=aSeed.z<.66?silver:aSeed.z<.81?violet:aSeed.z<.93?amber:teal;
 vLight=.25+max(0.,dot(normal,normalize(vec3(-.4,.7,1.))))*.9+max(0.,dot(normal,normalize(vec3(.8,-.3,-.8))))*.16+pressure*.2;
 vFade=1.-dissolve*.5;
}`;
const fragment=`precision mediump float;varying mediump vec3 vColor;varying mediump float vLight,vFade;void main(){gl_FragColor=vec4(vColor*vLight,vFade);}`;
export default function Hero(){
 const ref=useRef<HTMLCanvasElement>(null);const [failed,setFailed]=useState('');
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const host=canvas.closest<HTMLElement>('.cinematic-hero');if(!host)return;
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});const inst=gl?.getExtension('ANGLE_instanced_arrays');if(!gl||!inst){setFailed(!gl?'WebGL unavailable':'Instancing unavailable');return}
 const buffers:WebGLBuffer[]=[],shaders:WebGLShader[]=[];const program=gl.createProgram()!;
 const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'Hero shader compilation failed');gl.attachShader(program,s)};
 try{shader(gl.VERTEX_SHADER,vertex);shader(gl.FRAGMENT_SHADER,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Hero shader link failed')}catch(error){setFailed(String(error));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);return}
 gl.useProgram(program);
 const attribute=(name:string,data:Float32Array,size:number,divisor:number)=>{const buffer=gl.createBuffer()!;buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);inst.vertexAttribDivisorANGLE(loc,divisor)};
 const corners=[[0,1,0],[-.866,-.5,.5],[.866,-.5,.5],[0,-.5,-1]],faces=[[0,1,2],[0,2,3],[0,3,1],[1,3,2]],verts:number[]=[],norms:number[]=[];
 for(const face of faces){const [a,b,c]=face.map(i=>corners[i]);const u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);for(const i of face){verts.push(...corners[i]);norms.push(...n.map(x=>x/len))}}
 attribute('aVertex',new Float32Array(verts),3,0);attribute('aNormal',new Float32Array(norms),3,0);
 const mobile=innerWidth<700;const count=mobile?950:innerWidth<1100?2100:3600;const core=new Float32Array(count*3),nerve=new Float32Array(count*3),scatter=new Float32Array(count*3),seeds=new Float32Array(count*4);
 let rng=42;const rand=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296};
 for(let i=0;i<count;i++){const u=rand()*Math.PI*2,v=rand()*Math.PI*2,r=Math.pow(rand(),.2),lobe=i%3;const a=u+.3*Math.sin(v*2);let x=(Math.cos(a)*(.75+.22*Math.sin(u*3))+.25*Math.cos(v))*r;let y=(Math.sin(a)*(.85+.1*Math.cos(u*2))+.25*Math.sin(v))*r;let z=Math.sin(v)*.48*r;
 x+=lobe===0?-.34:lobe===1?.28:0;y+=lobe===2?.2:-.1;core.set([x*1.25,y*.9,z],i*3);
 const branch=i%9,t=rand(),sign=branch%2?1:-1;const nx=sign*(.12+t*1.62),ny=Math.sin(t*2.7+branch*.7)*(.15+t*.78),nz=Math.cos(t*3.4+branch)*.37;nerve.set([nx+(rand()-.5)*.14,ny+(rand()-.5)*.12,nz+(rand()-.5)*.13],i*3);
 scatter.set([(rand()-.5)*6,(rand()-.5)*4.5,(rand()-.5)*5],i*3);seeds.set([rand(),.013+rand()*.02,rand(),rand()],i*4)}
 attribute('aCore',core,3,1);attribute('aNerve',nerve,3,1);attribute('aScatter',scatter,3,1);attribute('aSeed',seeds,4,1);
 const uniforms=Object.fromEntries(['uTime','uProgress','uAspect','uMobile','uPointer','uInfluence'].map(name=>[name,gl.getUniformLocation(program,name)]));gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
 let frame=0,last=0,time=0,visible=true,width=1,height=1;let px=0,py=0,tx=0,ty=0,influence=0,targetInfluence=0,progress=0,dirty=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const resize=()=>{const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,mobile?1:1.5);canvas.width=width*dpr;canvas.height=height*dpr;gl.viewport(0,0,canvas.width,canvas.height);dirty=true};
 const move=(e:PointerEvent)=>{if(reduced.matches)return;const r=canvas.getBoundingClientRect();tx=(e.clientX-r.left-width/2)/height*3.8;ty=-(e.clientY-r.top-height/2)/height*3.8;targetInfluence=1;dirty=true};const leave=()=>{targetInfluence=0};
 const draw=(now:number)=>{if(visible&&!document.hidden&&(now-last>=32||dirty)){const dt=Math.min((now-last)/1000,.06)||.016;last=now;const paused=host.dataset.paused==='true';const canMove=!paused&&!reduced.matches;if(canMove)time+=dt;const damp=1-Math.exp(-dt*6);px+=(tx-px)*damp;py+=(ty-py)*damp;influence+=((canMove?targetInfluence:0)-influence)*damp;const target=reduced.matches?.28:parseFloat(host.dataset.sceneProgress||'0');progress+=(target-progress)*(1-Math.exp(-dt*8));if(canMove||dirty||Math.abs(target-progress)>.001){gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uProgress,progress);gl.uniform1f(uniforms.uAspect,width/height);gl.uniform1f(uniforms.uMobile,mobile?1:0);gl.uniform2f(uniforms.uPointer,px,py);gl.uniform1f(uniforms.uInfluence,influence);inst.drawArraysInstancedANGLE(gl.TRIANGLES,0,12,count);dirty=false;canvas.dataset.ready='true'}}frame=requestAnimationFrame(draw)};
 const ro=new ResizeObserver(resize);ro.observe(canvas);const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;dirty=true});io.observe(host);host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);const lost=(e:Event)=>{e.preventDefault();setFailed('WebGL context lost')};canvas.addEventListener('webglcontextlost',lost);resize();frame=requestAnimationFrame(draw);
 return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program)};
 },[]);
 return failed?<HeroFallback reason={failed}/>:<canvas ref={ref} className="hero-webgl-canvas" aria-hidden="true"/>;
}
