import {projects} from './data';
import {referenceProjects} from './ProjectCollection';
export type ProjectEntry={name:string;description:string;category:string;status:string;repo?:string;live?:string|null;image?:string;slug?:string;tags:readonly string[]};
export const projectEntries:ProjectEntry[]=[
 ...projects.map(p=>({...p,status:'COMPLETED PROJECT'})),
 {name:'Xroga',description:'An AI app builder that builds, tests and ships code you own. Currently working on the product.',category:'AI / PRODUCT DEVELOPMENT',status:'WORK IN PROGRESS',live:'https://xroga.com/',tags:['AI','App builder','Current development']},
 ...referenceProjects.map(([name,description,repo,live])=>({name,description,repo:`https://github.com/mabdullah-built/${repo}`,live,category:'OPEN SOURCE / EXTERNAL REPOSITORY',status:'REFERENCE PROJECT',tags:['Open source','Source available']})),
];
