import Link from 'next/link';
import Navigation from './Navigation';
import Effects from './Effects';
import ContactBot from './ContactBot';
import {email,github} from './data';
export default function Shell({children}:{children:React.ReactNode}){return <><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main">{children}</main><footer><div className="footer-top"><Link href="/" className="footer-name">MUHAMMAD<br/>LUQMAN<span>/</span></Link><div><p>Full Stack Developer</p><p className="mono">&lt;building ideas into working products /&gt;</p></div><a href="#main" className="back-top" aria-label="Back to top">↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Muhammad Luqman</span><div><a href={github} target="_blank" rel="noreferrer" data-cursor="git push">GITHUB ↗</a><a href={`mailto:${email}`} data-cursor="connect();">EMAIL ↗</a><Link href="/contact?type=Discovery%20call">REQUEST A CALL ↗</Link></div><Link href="/contact">Contact Us ↗</Link></div></footer><ContactBot/><Effects/></>}
