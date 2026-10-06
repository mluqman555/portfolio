export type NarrationSegment={title:string;text:string;audio?:string};
export const narration:Record<string,NarrationSegment>={
 introduction:{title:'Introduction',text:"Welcome. You’re exploring the portfolio of Muhammad Luqman. I’m Muhammad Luqman, a Full Stack Developer based in Faisalabad, Punjab, Pakistan, available for remote work. Have a concept? I build market-ready digital products from end to end. I build custom websites, full-stack platforms, SaaS products, advanced AI systems, AI bots, tools and software, robust APIs and integrations, workflow automations, Web3 systems, intuitive user experiences, and products designed for organic search visibility."},
 work:{title:'My Work',text:"My work is where ideas become operational. These projects connect interface design, application logic, APIs, data and real product functionality."},
 universe:{title:'Development Universe',text:"My development universe connects the disciplines behind the full stack, from React, Next.js, TypeScript and Node.js to data, APIs, AI, automation, Web3 and deployment."},
 about:{title:'About',text:"I don’t treat a product as a collection of separate screens. I design and engineer the system behind the experience, with clarity, performance, maintainability and real-world usability in mind."},
 expertise:{title:'System Architecture',text:"One product, every layer. Frontend, backend, data, AI, automation, integrations and delivery work as parts of the same connected system."},
 process:{title:'Process',text:"Good products don’t happen by accident. My process moves from discovery and structure through design, engineering, validation and launch."},
 services:{title:'Services',text:"I build full-stack web applications, SaaS products, distinctive frontend experiences, backend and API systems, AI automations, and focused MVPs."},
 contact:{title:'Contact',text:"Have a concept? Tell me what you’re building, where it stands today, and what the product needs to achieve. Let’s turn it into something real."}
};
// Display copy and spoken copy stay separate. Attach a reviewed audio URL to a
// segment to prefer recorded narration; unavailable audio falls back to speech.
export const pronunciation:[RegExp,string][]=[
 [/\bSaaS\b/g,'sass'],[/\bAPIs\b/g,"A P I's"],[/\bAPI\b/g,'A P I'],[/UI\/UX/g,'U I, U X'],[/\bWeb3\b/g,'Web three'],[/Next\.js/g,'Next dot J S'],[/Node\.js/g,'Node dot J S'],[/\bTypeScript\b/g,'Type Script'],[/\bJavaScript\b/g,'Java Script'],[/\bLLM\b/g,'L L M'],[/\bSEO\b/g,'S E O'],[/\bAI\b/g,'A I']
];
export function spokenText(text:string){return pronunciation.reduce((copy,[pattern,value])=>copy.replace(pattern,value),text).replace(/[|•→]/g,', ').replace(/\s+/g,' ').trim()}
