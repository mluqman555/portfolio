import Link from 'next/link';
import Shell from '../../components/Shell';
import {Contact} from '../../components/Sections';
import {articles} from '../../components/blogData';
import {pageMetadata} from '../../components/seo';
export const metadata=pageMetadata('/blog','Full Stack Development Articles | Muhammad Luqman','Practical articles on developer portfolios, MVP planning, API integration and accessible 3D web experiences by Muhammad Luqman.');
export default function Blog(){return <Shell><div className="page-intro"><span className="mono">ENGINEERING ARTICLES</span><h1>Notes from the build.</h1><p>Practical ways to plan products, inspect engineering and make interactive experiences easier to use.</p></div><div className="guides-grid">{articles.map(a=><article className="guide" key={a.slug}><span className="mono">MUHAMMAD LUQMAN</span><h2><Link href={`/blog/${a.slug}`}>{a.title}</Link></h2><p>{a.description}</p><Link className="text-link" href={`/blog/${a.slug}`}>READ ARTICLE ↗</Link></article>)}</div><Contact/></Shell>}
