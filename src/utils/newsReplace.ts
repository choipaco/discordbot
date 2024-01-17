export function newsReplace(title:string){
    const res = title
    .replace(/<b>(.*?)<\/b>/g, '**$1**')
    .replace(/`/g, '\\`')
    .replace('[', '「')
    .replace(']', '」')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

    return res;
}