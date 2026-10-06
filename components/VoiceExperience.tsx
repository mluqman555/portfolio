'use client';

import {useEffect,useRef,useState} from 'react';
import {Play,Pause,RotateCcw,Square} from 'lucide-react';
import {introductionAudio,introductionText,spokenIntroduction} from './narration';
import styles from './VoiceExperience.module.css';

type State='ready'|'playing'|'paused'|'complete'|'unavailable';
const maleNames=/\b(Guy|Andrew|Christopher|Brian|Ryan|Roger|David|Daniel|George|Mark|James|Alex|Richard|Fred|Tom|Oliver|Arthur|Sean|Liam|Rishi|Ravi|Prabhat)\b/i;
export default function VoiceExperience(){
 const audio=useRef<HTMLAudioElement>(null);
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const lines=useRef(spokenIntroduction.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[spokenIntroduction]);
 const index=useRef(0);
 const stateRef=useRef<State>('ready');
 const [state,setState]=useState<State>('ready');
 const [available,setAvailable]=useState(Boolean(introductionAudio));
 const update=(next:State)=>{stateRef.current=next;setState(next)};
 const voice=()=>window.speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)&&maleNames.test(v.name)).sort((a,b)=>Number(/Guy|Andrew|Christopher|Ryan|Brian/i.test(b.name))-Number(/Guy|Andrew|Christopher|Ryan|Brian/i.test(a.name)))[0];
 const speak=()=>{
  if(index.current>=lines.current.length){utterance.current=null;update('complete');return}
  const selected=voice();if(!selected){update('unavailable');return}
  const speech=new SpeechSynthesisUtterance(lines.current[index.current]);
  speech.voice=selected;speech.lang=selected.lang;speech.volume=1;speech.rate=.98;speech.pitch=1.12;
  speech.onstart=()=>update('playing');
  speech.onend=()=>{if(utterance.current!==speech)return;index.current++;speak()};
  speech.onerror=e=>{if(utterance.current!==speech)return;utterance.current=null;update(e.error==='not-allowed'?'ready':'unavailable')};
  utterance.current=speech;update('playing');window.speechSynthesis.speak(speech);
 };
 const stop=()=>{
  utterance.current=null;index.current=0;
  if(introductionAudio&&audio.current){audio.current.pause();audio.current.currentTime=0}
  else if('speechSynthesis' in window)window.speechSynthesis.cancel();
  update('ready');
 };
 const toggle=()=>{
  if(introductionAudio){const recording=audio.current;if(!recording)return;if(!recording.paused){recording.pause();return}if(recording.ended)recording.currentTime=0;void recording.play().catch(()=>update('ready'));return}
  if(!('speechSynthesis' in window)){update('unavailable');return}
  if(stateRef.current==='playing'){window.speechSynthesis.pause();update('paused');return}
  if(stateRef.current==='paused'){window.speechSynthesis.resume();update('playing');return}
  if(stateRef.current==='complete')index.current=0;
  speak();
 };
 useEffect(()=>{
  const synth='speechSynthesis' in window?window.speechSynthesis:null;
  const ready=()=>setAvailable(Boolean(introductionAudio)||Boolean(synth&&voice()));
  const visibility=()=>{
   if(!document.hidden||stateRef.current!=='playing')return;
   if(introductionAudio)audio.current?.pause();else synth?.pause();
   update('paused');
  };
  ready();synth?.addEventListener('voiceschanged',ready);document.addEventListener('visibilitychange',visibility);
  return()=>{utterance.current=null;audio.current?.pause();synth?.cancel();synth?.removeEventListener('voiceschanged',ready);document.removeEventListener('visibilitychange',visibility)};
 },[]);
 return <aside className={styles.player} aria-label="Spoken introduction" data-voice-type={introductionAudio?'recording':'synthetic'}>
  {introductionAudio&&<audio ref={audio} src={introductionAudio} preload="none" onPlay={()=>update('playing')} onPause={()=>{if(stateRef.current!=='complete')update('paused')}} onEnded={()=>update('complete')} onError={()=>update('unavailable')}/>}
  <div className={styles.controls}><button type="button" onClick={toggle} disabled={!available||state==='unavailable'} aria-label={state==='playing'?'Pause introduction':state==='complete'?'Replay introduction':'Play introduction'}>
   {state==='playing'?<Pause size={16} aria-hidden="true"/>:state==='complete'?<RotateCcw size={16} aria-hidden="true"/>:<Play size={16} aria-hidden="true"/>}
   {state==='playing'?'Pause introduction':state==='complete'?'Replay introduction':'Listen to introduction'}
  </button>{(state==='playing'||state==='paused')&&<button type="button" onClick={stop} aria-label="Stop introduction"><Square size={14} aria-hidden="true"/></button>}</div>
  <details><summary>Read introduction</summary><p>{introductionText}</p><small>{introductionAudio?'Recorded introduction':'Synthetic voice · sound depends on your device.'}</small>{(!available||state==='unavailable')&&<small role="status">A supported English male voice isn’t available on this device.</small>}</details>
 </aside>;
}
