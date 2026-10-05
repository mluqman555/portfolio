import * as T from 'three';
export function projectArtifact(index:number,metal:T.Material,dark:T.Material,accent:T.Material){const g=new T.Group();const box=new T.BoxGeometry(.5,.5,.5),ring=new T.TorusGeometry(.9,.065,10,48),disc=new T.CylinderGeometry(.7,.7,.09,32);const add=(geometry:T.BufferGeometry,mat:T.Material,x=0,y=0,z=0)=>{const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);g.add(m);return m};
 if(index===0||index===3){for(let j=0;j<3;j++){const m=add(ring,j===1?accent:metal);m.rotation.set(j*.55,.45+j*.35,0);m.scale.setScalar(1-j*.15)}for(let j=0;j<8;j++){const a=j*Math.PI/4;add(new T.SphereGeometry(.09,12,8),accent,Math.cos(a)*.9,Math.sin(a)*.9,0)}}
 else if(index===1||index===2||index===5||index===6){for(let j=0;j<9;j++){const x=(j%3-1)*.62,y=(Math.floor(j/3)-1)*.62,z=index===2?(j%2)*.34:0;const m=add(box,j%3===0?metal:dark,x,y,z);if(index===6)m.scale.setScalar(j%2?.7:1);if(index===5&&j>5)m.position.z=.4}const m=add(ring,accent);m.rotation.y=.7;m.scale.setScalar(1.15)}
 else if(index===4){for(let j=0;j<2;j++){const m=add(new T.BoxGeometry(.72,1.15,.65),metal,(j-.5)*.83,0,0);m.rotation.y=(j-.5)*.2}const m=add(ring,accent);m.scale.setScalar(.55);m.position.z=.6}
 else if(index===7){for(let j=0;j<3;j++){const m=add(new T.BoxGeometry(1.4-j*.2,.9+j*.1,.055),j===1?metal:dark,(j-1)*.25,(j-1)*.12,j*.25);m.rotation.y=-.35}}
 else{for(let j=0;j<(index===9?4:1);j++){const m=add(disc,metal,0,j*.18-.3,0);m.rotation.x=.35}add(new T.BoxGeometry(1.1,1.1,1.1),dark)}
 g.position.set(1.1,.5,.5);return g;}
