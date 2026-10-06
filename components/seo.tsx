import type {Metadata} from 'next';
export const siteUrl='https://www.luqmandev.top';
export function pageMetadata(path:string,title:string,description:string):Metadata{return {title:{absolute:title},description,alternates:{canonical:path},openGraph:{type:'website',url:`${siteUrl}${path}`,title,description,siteName:'Muhammad Luqman',images:[{url:'/opengraph-image',width:1200,height:630,alt:'Muhammad Luqman, Full Stack Developer'}]},twitter:{card:'summary_large_image',title,description,images:['/opengraph-image']}}}
export function JsonLd({data}:{data:Record<string,unknown>}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>}
