import {pageMetadata} from '../../components/seo';
import Shell from '../../components/Shell';
import {Services,Process,Contact} from '../../components/Sections';
export const metadata=pageMetadata('/services','Full Stack Web Development Services | Muhammad Luqman','Explore full stack applications, SaaS development, React frontend experiences, backend APIs, AI integrations and MVP development.');
export default function ServicesPage(){return <Shell><div className="page-intro"><span className="mono">SERVICES / FROM CONCEPT TO PRODUCTION</span><h1>Built around<br/>your next move.</h1><p>From an early idea to a complex integration, I connect the design, application logic and delivery into one coherent product.</p></div><Services/><Process/><Contact/></Shell>}
