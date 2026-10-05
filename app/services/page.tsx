import Shell from '../../components/Shell';
import {Services,Process,Contact} from '../../components/Sections';
export const metadata={alternates:{canonical:'/services'},title:'Services — Muhammad Luqman'};
export default function ServicesPage(){return <Shell><div className="page-intro"><span className="mono">SERVICES / FROM CONCEPT TO PRODUCTION</span><h1>Built around<br/>your next move.</h1><p>From an early idea to a complex integration, I connect the design, application logic and delivery into one coherent product.</p></div><Services/><Process/><Contact/></Shell>}
