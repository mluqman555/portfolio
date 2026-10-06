'use client';
import {useEffect,useRef,useState} from 'react';
import {introductionText,introductionAudio,spokenText} from './narration';

/** One introduction per page load. Browsers may require the first user gesture. */
export default function VoiceExperience(){
 const music=useRef<HTMLAudioElement>(null);
 const [state,setState]=useState('waiting');
 useEffect(()=>{
  let disposed=false,started=false,complete=false,pending=false,index=0,musicPending=false;
  let speech:SpeechSynthesisUtterance|null=null,recording:HTMLAudioElement|null=null;
  const lines=spokenText(introductionText).match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[spokenText(introductionText)];
  const finish=()=>{complete=true;pending=false;speech=null;setState('complete')};
  const next=()=>{
   if(disposed||complete||document.hidden)return;
   if(index>=lines.length){finish();return}
   const synth=window.speechSynthesis,voices=synth.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
   if(!voices.length){pending=false;setState('unavailable');return}
   speech=new SpeechSynthesisUtterance(lines[index]);speech.lang='en-US';speech.volume=1;speech.rate=1.12;speech.pitch=.82;
   speech.voice=voices.find(v=>/Guy|David|Daniel|George|Mark|James|Alex|Richard|Fred/i.test(v.name))||voices.find(v=>v.default)||voices[0];
   speech.onstart=()=>{if(disposed)return;started=true;pending=false;setState('speaking')};
   speech.onend=()=>{if(disposed)return;index++;next()};
   speech.onerror=e=>{if(disposed)return;pending=false;if(e.error==='not-allowed'&&!started){setState('waiting');return}if(e.error!=='interrupted'&&e.error!=='canceled')finish()};
   synth.speak(speech);
  };
  const beginNarration=()=>{
   if(disposed||complete||started||pending||document.hidden)return;
   if(introductionAudio){pending=true;recording=new Audio(introductionAudio);recording.volume=1;recording.onplaying=()=>{started=true;pending=false;setState('speaking')};recording.onended=finish;recording.onerror=()=>{recording?.pause();recording=null;pending=false;if('speechSynthesis' in window)next()};void recording.play().catch(()=>{pending=false});return}
   if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){setState('unavailable');return}
   pending=true;next();
  };
  const beginMusic=()=>{
   const track=music.current;if(!track||disposed||document.hidden||musicPending||!track.paused)return;
   track.volume=.4;musicPending=true;void track.play().catch(()=>{}).finally(()=>{musicPending=false});
  };
  const activate=()=>{beginMusic();beginNarration()};
  const visibility=()=>{if(document.hidden){music.current?.pause();recording?.pause();if(speech&&'speechSynthesis' in window)window.speechSynthesis.pause()}else{beginMusic();if(recording&&started)void recording.play().catch(()=>{});else if(speech&&started)window.speechSynthesis.resume();else if(started&&!complete)next();else beginNarration()}};
  const voicesReady=()=>{if(!started&&!complete)beginNarration()};
  document.addEventListener('pointerdown',activate,{passive:true});
  document.addEventListener('keydown',activate);
  document.addEventListener('visibilitychange',visibility);
  if('speechSynthesis' in window)window.speechSynthesis.addEventListener('voiceschanged',voicesReady);
  activate();
  return()=>{disposed=true;music.current?.pause();recording?.pause();if(speech&&'speechSynthesis' in window)window.speechSynthesis.cancel();document.removeEventListener('pointerdown',activate);document.removeEventListener('keydown',activate);document.removeEventListener('visibilitychange',visibility);if('speechSynthesis' in window)window.speechSynthesis.removeEventListener('voiceschanged',voicesReady)};
 },[]);
 return <audio ref={music} src="/api/background-music" preload="none" loop hidden data-introduction-state={state} data-music-volume="0.4" aria-hidden="true"/>;
}
