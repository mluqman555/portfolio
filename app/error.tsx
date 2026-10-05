'use client';
export default function Error({reset}:{reset:()=>void}){return <main className="error-page"><h1>Let’s try again.</h1><p>The page couldn’t finish loading. Your browser can retry the request.</p><button className="button button-white" onClick={reset}>RELOAD THE SYSTEM ↗</button></main>}
