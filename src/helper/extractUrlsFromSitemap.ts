/*
*
*/
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * Fetches the content of a sitemap XML file from a given URL.
 * @param sitemapUrl The URL of the sitemap.xml file.
 * @returns A Promise that resolves to the XML content as a string, or null if fetching fails.
 */
async function getSitemapXmlContent(sitemapUrl: string): Promise<string | null> {
    try {
        console.log(`Workspaceing sitemap from: ${sitemapUrl}`);
        const response = await axios.get(sitemapUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/xml, text/xml', // Request XML content
                'Accept-Encoding': 'gzip, deflate, br', // Handle compressed responses
            },
            timeout: 15000, // 15 seconds timeout
        });

        if (response.status === 200) {
            console.log('Sitemap fetched successfully.');
            return response.data;
        } else {
            console.error(`Failed to fetch sitemap from ${sitemapUrl}. Status: ${response.status}`);
            return null;
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching sitemap ${sitemapUrl}: HTTP Error - ${error.response?.status || 'Unknown'}`);
        } else {
            console.error(`Error fetching sitemap ${sitemapUrl}: ${error.message}`);
        }
        return null;
    }
}

/**
 * Parses an XML sitemap string and extracts all URLs from <loc> tags.
 * @param xmlContent The full content of the sitemap.xml file.
 * @returns A Promise that resolves to an array of URLs (strings).
 */
async function extractUrlsFromSitemap(xmlContent: string): Promise<string[]> {
    try {
        const result = await parseStringPromise(xmlContent);
        const urls: string[] = [];

        // Check if urlset and url arrays exist and are valid
        // The structure from xml2js for a sitemap is usually result.urlset.url where 'url' is an array
        // Each item in the 'url' array will have a 'loc' property, which is itself an array containing the URL string.
        if (result && result.urlset && Array.isArray(result.urlset.url)) {
            for (const urlEntry of result.urlset.url) {
                // Ensure urlEntry.loc exists, is an array, and its first element is a string
                if (urlEntry.loc && Array.isArray(urlEntry.loc) && typeof urlEntry.loc[0] === 'string') {
                    urls.push(urlEntry.loc[0]);
                }
            }
        } else {
            console.warn('Sitemap structure not as expected (missing urlset or url array).');
        }
        return urls;
    } catch (error) {
        console.error('Error parsing sitemap XML:', error);
        return [];
    }
}

// Example of how to use these functions:
export async function processSitemapFromUrl(sitemapUrl: string) {
    const xmlContent = await getSitemapXmlContent(sitemapUrl);
    if (xmlContent) {
        const urls = await extractUrlsFromSitemap(xmlContent);
        console.log(`\nFound ${urls.length} URLs in the sitemap:`);
        // console.log(urls); // Uncomment to see all extracted URLs
        return urls;
    } else {
        console.log('Could not retrieve sitemap content.');
        return [];
    }
}
