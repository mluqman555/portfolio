'use client';

import {useEffect,useRef,useState} from 'react';
import {Play,Pause,RotateCcw} from 'lucide-react';
import {introductionAudio,introductionText} from './narration';

/** Plays only a supplied recording; never substitutes a synthetic browser voice. */
export default function VoiceExperience(){
 const audio=useRef<HTMLAudioElement>(null);
 const [state,setState]=useState<'ready'|'playing'|'paused'|'complete'|'error'>('ready');
 useEffect(()=>{
  if(!introductionAudio)return;
  const recording=audio.current;
  if(!recording)return;
  let attempted=false;
  const activate=()=>{
   if(attempted||document.hidden)return;
   attempted=true;
   void recording.play().catch(()=>{setState('ready')});
   document.removeEventListener('pointerdown',activate);
   document.removeEventListener('keydown',activate);
  };
  const visibility=()=>{if(document.hidden&&!recording.paused)recording.pause()};
  document.addEventListener('pointerdown',activate,{passive:true});
  document.addEventListener('keydown',activate);
  document.addEventListener('visibilitychange',visibility);
  return()=>{recording.pause();document.removeEventListener('pointerdown',activate);document.removeEventListener('keydown',activate);document.removeEventListener('visibilitychange',visibility)};
 },[]);
 if(!introductionAudio)return null;
 const toggle=()=>{
  const recording=audio.current;if(!recording)return;
  if(!recording.paused){recording.pause();return}
  if(recording.ended)recording.currentTime=0;
  void recording.play().catch(()=>setState('error'));
 };
 return <aside aria-label="Spoken introduction" style={{position:'fixed',bottom:24,left:24,zIndex:50,maxWidth:'calc(100vw - 48px)',background:'#101722',border:'1px solid #b7c8e144',borderRadius:14,padding:'10px 14px',color:'#e6eefb',fontSize:13}}>
  <audio ref={audio} src={introductionAudio} preload="none" onPlay={()=>setState('playing')} onPause={()=>setState(s=>s==='complete'?s:'paused')} onEnded={()=>setState('complete')} onError={()=>setState('error')}/>
  <button type="button" onClick={toggle} disabled={state==='error'} aria-label={state==='playing'?'Pause introduction':state==='complete'?'Replay introduction':'Play introduction'} style={{display:'flex',alignItems:'center',gap:10,border:0,background:'transparent',color:'inherit',fontSize:13}}>
   {state==='playing'?<Pause size={16}/>:state==='complete'?<RotateCcw size={16}/>:<Play size={16}/>}
   {state==='error'?'Introduction unavailable':state==='playing'?'Pause introduction':state==='complete'?'Replay introduction':'Listen to introduction'}
  </button>
  <details style={{marginTop:6,fontSize:11}}><summary>Read introduction</summary><p style={{maxWidth:320,fontSize:13,margin:'10px 0 0'}}>{introductionText}</p></details>
 </aside>;
}
