import {pageMetadata} from '../../components/seo';
import Shell from '../../components/Shell';
import {About,Expertise,Process,Journey,Contact} from '../../components/Sections';
export const metadata=pageMetadata('/about','About Muhammad Luqman | Full Stack Developer','Meet Muhammad Luqman and explore his approach to frontend engineering, backend systems, APIs and product development.');
export default function AboutPage(){return <Shell><h1 className="sr-only">About Muhammad Luqman</h1><About/><Expertise/><Process/><Journey/><Contact/></Shell>}
