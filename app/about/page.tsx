import Shell from '../../components/Shell';
import {About,Expertise,Process,Journey,Contact} from '../../components/Sections';
export const metadata={alternates:{canonical:'/about'},title:'About — Muhammad Luqman'};
export default function AboutPage(){return <Shell><h1 className="sr-only">About Muhammad Luqman</h1><About/><Expertise/><Process/><Journey/><Contact/></Shell>}
