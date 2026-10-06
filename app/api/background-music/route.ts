import {NextResponse} from 'next/server';
// Resolve the supplied song's current streaming URL instead of keeping an expiring token.
const songPage='https://284367-the-godfather.mp3.pm/song/90149686-theme-song/';
export async function GET(){
 try{
  const page=await fetch(songPage,{next:{revalidate:300},signal:AbortSignal.timeout(8000)});
  if(!page.ok)return new NextResponse(null,{status:503});
  const html=await page.text();
  const match=html.match(/<meta\s+property=["']og:audio["']\s+content=["']([^"']+)["']/i);
  if(!match)return new NextResponse(null,{status:503});
  const url=new URL(match[1].replace(/&amp;/g,'&'));
  if(url.protocol!=='https:'||url.hostname!=='cs1.mp3.pm'||!url.pathname.startsWith('/listen/90149686/'))return new NextResponse(null,{status:503});
  return NextResponse.redirect(url,307);
 }catch{return new NextResponse(null,{status:503})}
}
