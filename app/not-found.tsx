import Link from 'next/link';
import Shell from '../components/Shell';
export default function NotFound(){return <Shell><section className="error-page"><span className="mono">ROUTE NOT FOUND</span><h1>404<span style={{color:'var(--green)'}}>_</span></h1><p>This route doesn’t exist. Let’s get you back to the system.</p><Link href="/" className="button button-white">BACK TO HOME ↗</Link></section></Shell>}
