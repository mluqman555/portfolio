/** Background music has been removed from the site. */
export async function GET(){
 return new Response(null,{status:410});
}
