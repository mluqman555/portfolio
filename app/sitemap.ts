import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{return ['','/work','/about','/services','/guides','/contact','/work/circle-arc','/work/circle-agent','/blog','/blog/portfolio','/blog/mvp','/blog/apis','/blog/motion'].map(p=>({url:`https://www.luqmandev.top${p}`,lastModified:new Date('2026-10-06'),changeFrequency:'monthly',priority:p?0.7:1}))}
