import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{return ['','/work','/about','/services','/guides','/contact','/work/circle-arc','/work/circle-agent','/work/luqman-portfolio'].map(p=>({url:`https://www.luqmandev.top${p}`,changeFrequency:'monthly',priority:p?0.7:1}))}
