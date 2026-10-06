import type {CSSProperties} from 'react';

// A self-contained abstract surface: replace this component for a future top-panel reference.
// Deterministic particles keep server and client rendering identical.
export default function ProjectEnergyPanel({index}:{index:number}){
 const random=(seed:number)=>{const n=Math.sin(seed*127.1+(index+1)*311.7)*43758.5453;return n-Math.floor(n)};
 return <div className="project-energy" aria-hidden="true" style={{'--energy-delay':`${-index*1.7}s`,'--energy-turn':`${index*19-35}deg`} as CSSProperties}>
  <div className="energy-atmosphere"><div className="energy-cloud energy-cloud-a"/><div className="energy-cloud energy-cloud-b"/><div className="energy-flow"/></div>
  <svg className="energy-dust" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
   {Array.from({length:100},(_,j)=><circle key={j} cx={random(j+1)*400} cy={random(j+201)*240} r={.35+random(j+401)*1.05} fill={j%5===0?'var(--card-accent)':'#e9f5ff'} opacity={.15+random(j+601)*.65}/>)}
   {Array.from({length:12},(_,j)=><path key={j} d={`M${random(j+901)*400} ${random(j+1101)*240}l${7+random(j+1301)*17} -2`} stroke="var(--card-accent)" strokeWidth=".5" opacity=".2"/>)}
  </svg>
  <div className="energy-sheen"/>
 </div>;
}
