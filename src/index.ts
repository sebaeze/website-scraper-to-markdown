/*
*
*/
import { readJsonArrayFromFile } from "./helper";
import { processSitemapFromUrl } from "./helper/extractUrlsFromSitemap";
//
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
/*
*
*/
async function scrapeDynamic(url:string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.evaluate(() => {
    return {
      title: document.querySelector('h1')?.innerText,
      body: document.querySelector('article')?.innerText,
      code: Array.from(document.querySelectorAll('pre')).map(el => el.innerText)
    };
  });
  //
  content.url = url ;
  //
  await browser.close();
  return content ;
}
// Convert to Markdown and save
async function saveToMarkdown(data:any, filename:string) {
  const markdown = `# ${data.title}\n\n[${data.url}](${data.url})\n\n${data.body}\n\n## Code Examples\n${data.code.map( (c:string) => `\`\`\`javascript\n${c}\n\`\`\``).join('\n')}`;
  await fs.writeFile(`${filename}`, markdown);
}
/*
*
*/
const scrapeArrayWebsites = async (arrayUrls:string[]) => {
    //
    for ( let pos=0; pos<arrayUrls.length; pos++ ){
        const url:string = arrayUrls[pos];
        console.log(`\n\n pos: ${pos} - url: ${url}`);
        const data = await scrapeDynamic(url); 
        const fileNN = path.join(__dirname, `../output/langchain-agent-docs_${pos}.md`)  ;
        console.log(`......fileNN: ${fileNN} `);
        await saveToMarkdown(data, fileNN );
    }
    //
} ;
//
(async () => {
    //
    let websites:string[] = await readJsonArrayFromFile( path.join(__dirname, "../websitesToScrape.json") );
    let sitemap:string|null = websites.filter((elem)=>elem.indexOf("sitemap")!=-1)[0] ;
    if ( sitemap!=null ){
        websites = await processSitemapFromUrl(sitemap) ;
    }
    //
    await scrapeArrayWebsites(websites);
    //
})();