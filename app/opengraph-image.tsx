import {ImageResponse} from 'next/og';
export const alt='Muhammad Luqman, Full Stack Developer';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:80,background:'#050b0a',color:'#eefbf4',borderBottom:'12px solid #41b67c'}}><div style={{display:'flex',fontSize:26,color:'#68d69e',marginBottom:28}}>FULL STACK DEVELOPER · CREATIVE ENGINEER</div><div style={{display:'flex',fontSize:83,fontWeight:800,letterSpacing:-4}}>Muhammad Luqman</div><div style={{display:'flex',fontSize:34,color:'#a7d5eb',marginTop:28}}>React · Next.js · APIs · Product engineering</div><div style={{display:'flex',fontSize:25,color:'#d6a465',marginTop:64}}>luqmandev.top</div></div>,size)}
