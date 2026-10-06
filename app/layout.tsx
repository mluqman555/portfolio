import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './identity-theme.css';
import './process-forge.css';
import './project-vault.css';
import './button-theme.css';
import './visual-system.css';
import './experience-upgrade.css';
import {JsonLd,pageMetadata,siteUrl} from '../components/seo';
const geist = localFont({src:'../public/fonts/geist.woff2',variable:'--font-geist',display:'swap',weight:'100 900'});
const mono = localFont({src:'../public/fonts/geist-mono.woff2',variable:'--font-mono',display:'swap',weight:'100 900'});
export const metadata:Metadata={...pageMetadata('/','Muhammad Luqman | Full Stack Developer, Websites, SaaS & AI','Muhammad Luqman, Full Stack Developer, builds custom websites, SaaS platforms, APIs, AI systems, automations and Web3 integrations for remote projects.'),metadataBase:new URL(siteUrl),authors:[{name:'Muhammad Luqman',url:`${siteUrl}/about`}],creator:'Muhammad Luqman',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Person','@id':`${siteUrl}/#person`,name:'Muhammad Luqman',alternateName:['M Luqman','Luqman'],url:siteUrl,jobTitle:'Full Stack Developer',image:`${siteUrl}/luqman-portrait-dark.webp`,sameAs:['https://github.com/mluqman555'],knowsAbout:['React','Next.js','TypeScript','Node.js','API development','Full stack web development','AI application development','MVP development','Custom websites','SaaS products','Automation','Web3 integrations','UI/UX','Organic search optimisation']},{'@type':'WebSite','@id':`${siteUrl}/#website`,url:siteUrl,name:'Muhammad Luqman',inLanguage:'en',publisher:{'@id':`${siteUrl}/#person`}}]}}/>{children}</body></html>}

