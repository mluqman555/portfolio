import Shell from '../components/Shell';
import HeroSequence from '../components/HeroSequence';
import VoiceExperience from '../components/VoiceExperience';
import UniverseLoader from '../components/UniverseLoader';
import {Label,Work,About,Expertise,Process,Services,Contact} from '../components/Sections';
export default function Home(){return <Shell><VoiceExperience/><HeroSequence/><div className="ticker" aria-hidden="true"><div>{[0,1].map(i=><span key={i}>FULL-STACK DEVELOPMENT <b>+</b> PRODUCT THINKING <b>+</b> CREATIVE ENGINEERING <b>+</b> CONNECTED SYSTEMS <b>+</b> </span>)}</div></div><Work/><section className="universe section" id="universe"><Label number="02">MY DEVELOPMENT UNIVERSE</Label><div className="universe-heading reveal"><h2>Different technologies.<br/><span>One connected system.</span></h2><p>I work across the complete application lifecycle—from interaction design and frontend engineering to APIs, data, automation and deployment.</p></div><UniverseLoader/></section><About/><Expertise/><Process/><Services/><Contact/></Shell>}
