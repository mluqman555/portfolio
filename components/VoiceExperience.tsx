'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {narration,spokenText} from './narration';
type Mode='loading'|'entry'|'silent'|'voice'|'muted';
const preferenceKey='luqman-voice-preference',seenKey='luqman-voice-seen';
export default function VoiceExperience(){
 const [mode,setMode]=useState<Mode>('loading'),[speaking,setSpeaking]=useState(false),[current,setCurrent]=useState('introduction'),[notice,setNotice]=useState('');
 const modeRef=useRef<Mode>('loading'),currentRef=useRef('introduction'),seen=useRef(new Set<string>()),audio=useRef<HTMLAudioElement|null>(null),utterance=useRef<SpeechSynthesisUtterance|null>(null),version=useRef(0);
 const remember=(value:string)=>{try{sessionStorage.setItem(preferenceKey,value)}catch{}};
 const changeMode=(value:Mode)=>{modeRef.current=value;setMode(value)};
 const stop=useCallback(()=>{version.current++;audio.current?.pause();audio.current=null;if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)},[]);
 const play=useCallback((key:string,explicit=false)=>{
  const segment=narration[key];if(!segment||modeRef.current!=='voice'||document.hidden||(!explicit&&seen.current.has(key)))return;
  stop();const ticket=version.current;setNotice('');
  const started=()=>{if(ticket!==version.current)return;seen.current.add(key);try{sessionStorage.setItem(seenKey,JSON.stringify([...seen.current]))}catch{}setSpeaking(true)};
  const finished=()=>{if(ticket===version.current){utterance.current=null;audio.current=null;setSpeaking(false)}};
  const failed=()=>{if(ticket!==version.current)return;setSpeaking(false);setNotice('Voice is unavailable in this browser. You can continue silently or retry.');modeRef.current='muted';setMode('muted')};
  let fallbackStarted=false;const fallback=()=>{
   if(ticket!==version.current||fallbackStarted)return;fallbackStarted=true;
   if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){failed();return}
   const speech=new SpeechSynthesisUtterance(spokenText(segment.text));speech.lang='en-US';speech.rate=.96;speech.pitch=.88;speech.volume=1;
   const voices=window.speechSynthesis.getVoices(),english=voices.filter(v=>/^en[-_]/i.test(v.lang));
   speech.voice=english.find(v=>/David|Mark|Daniel|Alex|Guy|George|Richard|Fred|James/i.test(v.name))||english.find(v=>v.default)||english[0]||null;
   speech.onstart=started;speech.onend=finished;speech.onerror=event=>{if(event.error!=='interrupted'&&event.error!=='canceled')failed()};utterance.current=speech;window.speechSynthesis.speak(speech);
  };
  if(segment.audio){const track=new Audio(segment.audio);audio.current=track;track.preload='none';track.onplaying=started;track.onended=finished;track.onerror=()=>{if(ticket===version.current){track.pause();audio.current=null;fallback()}};void track.play().catch(()=>{if(ticket===version.current){track.pause();audio.current=null;fallback()}})}else fallback();
 },[stop]);
 useEffect(()=>{
  let stored:string|null=null;try{stored=sessionStorage.getItem(preferenceKey);const value=JSON.parse(sessionStorage.getItem(seenKey)||'[]');if(Array.isArray(value))seen.current=new Set(value.filter(x=>typeof x==='string'))}catch{}
  modeRef.current=stored==='silent'?'silent':stored==='voice'?'muted':'entry';setMode(modeRef.current);
  const targets=Object.keys(narration).map(id=>document.getElementById(id)).filter((e):e is HTMLElement=>!!e);let timer:ReturnType<typeof setTimeout>|undefined;
  const observer=new IntersectionObserver(()=>{
   const mid=innerHeight*.5,active=targets.filter(e=>{const r=e.getBoundingClientRect();return r.top<mid&&r.bottom>mid})[0];if(!active||active.id===currentRef.current)return;
   currentRef.current=active.id;setCurrent(active.id);clearTimeout(timer);timer=setTimeout(()=>play(active.id),750);
  },{rootMargin:'-35% 0px -35% 0px',threshold:0});targets.forEach(el=>observer.observe(el));
  const visibility=()=>{if(modeRef.current!=='voice')return;if(document.hidden){audio.current?.pause();if('speechSynthesis' in window)window.speechSynthesis.pause()}else{if(audio.current)void audio.current.play().catch(()=>{stop();setNotice('Select replay to resume narration.')});else if('speechSynthesis' in window)window.speechSynthesis.resume();if(!utterance.current&&!audio.current)play(currentRef.current)}};
  document.addEventListener('visibilitychange',visibility);return()=>{clearTimeout(timer);observer.disconnect();document.removeEventListener('visibilitychange',visibility);stop()};
 },[play,stop]);
 const enter=(voice:boolean)=>{remember(voice?'voice':'silent');changeMode(voice?'voice':'silent');if(voice)play(currentRef.current,true);else stop()};
 const toggle=()=>{if(modeRef.current==='voice'){changeMode('muted');remember('voice');stop()}else{changeMode('voice');remember('voice');play(currentRef.current,true)}};
 if(mode==='loading')return null;
 if(mode==='entry')return <aside className="voice-entry" role="dialog" aria-modal="false" aria-labelledby="voice-entry-title"><span className="mono">WELCOME TO LUQMAN.DEV</span><h2 id="voice-entry-title">Explore with a voice guide.</h2><p>A short introduction, then narration as you explore.</p><div><button type="button" onClick={()=>enter(true)}>ENTER WITH VOICE <span aria-hidden="true">↗</span></button><button type="button" onClick={()=>enter(false)}>ENTER SILENTLY</button></div></aside>;
 return <aside className="voice-dock" data-speaking={speaking} aria-label="Portfolio voice narration"><button type="button" onClick={toggle} aria-label={mode==='voice'?'Mute voice narration':'Enable voice narration'} aria-pressed={mode==='voice'}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 9H8L13 5V19L8 15H4Z"/>{mode==='voice'?<path d="M16 8Q20 12 16 16M18 5Q25 12 18 19"/>:<path d="M17 9L22 15M22 9L17 15"/>}</svg><span>{mode==='voice'?(speaking?'VOICE / ACTIVE':'VOICE / READY'):'VOICE / OFF'}</span></button>{mode==='voice'&&<button type="button" onClick={()=>play(currentRef.current,true)} aria-label="Replay current section narration">↻</button>}<span className="voice-section mono">{narration[current]?.title}</span>{notice&&<p role="status">{notice}</p>}</aside>
}
