// The same ribbon topology continuously interpolates through six related silhouettes.
const states=[
 [1.25,.5,.6,.4,1.2,.75], // streams connect
 [1.5,.9,.3,.85,.8,.55], // separated layers
 [1.1,.35,1.2,.4,1.35,1.15], // expressive surfaces
 [.85,1.25,.45,.65,.7,.65], // structural pathways
 [1.35,.6,1.1,1.25,1.15,.95], // adaptive loops
 [1,.35,.35,.3,1,.8], // converged form
];
export function writeServiceForm(out:Float32Array,segments:number,rows:number,bands:number,phase:number,time:number,hover:number,hoverIndex:number=-1){const base=Math.min(4,Math.floor(phase)),raw=Math.max(0,Math.min(1,phase-base)),mix=raw*raw*(3-2*raw);const parameter=(k:number)=>states[base][k]+(states[base+1][k]-states[base][k])*mix;const turn=parameter(0),depth=parameter(1),wave=parameter(2),warp=parameter(3),stretch=parameter(4),curl=parameter(5);let at=0;for(let b=0;b<bands;b++){const layer=(b-(bands-1)/2)/bands;for(let i=0;i<=segments;i++){const t=i/segments*Math.PI*2;for(let j=0;j<=rows;j++){const v=j/rows-.5;const twist=t*turn+layer*2.2+Math.sin(t*2+time*.19)*.28;const breathing=Math.sin(t*3+time*.33+b)*.11;const radius=1.12+Math.sin(t*2+layer*4+time*.21)*wave*.23+layer*depth;const width=v*(.27+Math.sin(t+time*.18)*.06)*(1+hover*.16*Math.exp(-Math.pow(b-hoverIndex,2)*.7));out[at++]=(radius+width*Math.cos(twist))*Math.cos(t)+Math.sin(t*3+time*.22)*warp*.22;out[at++]=(radius+width*Math.cos(twist))*Math.sin(t)*stretch+layer*.5+breathing;out[at++]=Math.sin(twist)*curl*.6+width*Math.sin(twist)+layer*depth*.75}}}}
