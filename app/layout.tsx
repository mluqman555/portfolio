import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const geist = localFont({src:'../public/fonts/geist.woff2',variable:'--font-geist',display:'swap',weight:'100 900'});
const mono = localFont({src:'../public/fonts/geist-mono.woff2',variable:'--font-mono',display:'swap',weight:'100 900'});
export const metadata: Metadata = { metadataBase:new URL('https://www.luqmandev.top'),title:'Muhammad Luqman — Full-Stack Developer & Creative Engineer',description:'Building ideas into working products. Explore Muhammad Luqman’s development universe: full-stack applications, thoughtful interfaces, APIs, AI, and production delivery.',alternates:{canonical:'/'},openGraph:{title:'Muhammad Luqman — Systems That Move',description:'Full-stack developer. Creative engineer. Building ideas into working products.',url:'https://www.luqmandev.top',siteName:'Muhammad Luqman',type:'website'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>}
