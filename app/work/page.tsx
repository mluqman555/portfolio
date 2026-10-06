import {pageMetadata} from '../../components/seo';
import Shell from '../../components/Shell';
import {Work,Contact} from '../../components/Sections';
export const metadata=pageMetadata('/work','Developer Portfolio and Selected Projects | Muhammad Luqman','Inspect Circle Arc Net, Circle Portfolio Agent and current Xroga development. View live applications, source code and clear project context.');
export default function WorkPage(){return <Shell><div className="page-intro"><span className="mono">WORK / SOURCE-AVAILABLE BUILDS</span><h1>Proof before<br/>promises.</h1><p>Explore connected applications and the engineering behind them. Explore current work and inspectable repositories, with clear source attribution.</p></div><Work/><Contact/></Shell>}
