import {pageMetadata} from '../../components/seo';
import Shell from '../../components/Shell';
import {Contact} from '../../components/Sections';
export const metadata=pageMetadata('/contact','Contact Muhammad Luqman | Start a Web Development Project','Discuss your web application, SaaS product, API integration or MVP with Muhammad Luqman. Share project details with an optional budget.');
export default function ContactPage(){return <Shell><h1 className="sr-only">Start a project with Muhammad Luqman</h1><Contact/></Shell>}
