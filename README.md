# Website Scraper to Markdown

The purpose of this project is Scrape websites and export to markdown files in order to train AI Agents.

It can process a list of URLs directly or extract URLs from a sitemap.xml file. The scraper uses Puppeteer to handle dynamically rendered content, extracting titles, main article bodies, and code examples.

## Features

*   Scrapes content from a predefined list of URLs or a sitemap.
*   Handles JavaScript-rendered websites using Puppeteer.
*   Extracts:
    *   Page title (from the first `<h1>` tag).
    *   Main content (from the first `<article>` tag).
    *   Code snippets (from all `<pre>` tags).
*   Converts scraped data into individual Markdown files.
*   Saves Markdown files to a local `output` directory.

## Prerequisites

*   Node.js (version 14.x or later recommended)
*   npm (Node Package Manager) or yarn

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sebaeze/website-scraper-to-markdown.git
    cd website-scraper-to-markdown
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```
    This will install Puppeteer, Axios, Cheerio, and other necessary packages.

## Configuration

1.  **Prepare your list of websites:**
    Create a file named `websitesToScrape.json` in the root directory of the project. This file should contain a JSON array of strings, where each string is a URL to scrape.

    **Example `websitesToScrape.json` with direct URLs:**
    ```json
    [
      "https://example.com/page1",
      "https://example.com/page2",
      "https://anothersite.com/articleA"
    ]
    ```

2.  **Using a Sitemap:**
    Alternatively, you can provide a URL to a `sitemap.xml` file. The script will automatically detect it, fetch all URLs from the sitemap, and then scrape each one.

    **Example `websitesToScrape.json` with a sitemap URL:**
    ```json
    [
      "https://example.com/sitemap.xml"
    ]
    ```
    If a sitemap URL is present, any other direct URLs in the file will be ignored, and only the URLs from the sitemap will be processed.

## Execution

1.  **Run the scraper script:**
    From the project's root directory, execute the following command:
    ```bash
    npm start
    ```
    (Assuming you have a `start` script in your `package.json` like `"start": "ts-node src/index.ts"`. If not, you can run it directly using `ts-node` if you have it installed globally, or after building the project.)

    To run directly with `ts-node` (if not using an npm script):
    ```bash
    npx ts-node src/index.ts
    ```

2.  **Output:**
    The script will process each URL, scrape its content, and save it as a Markdown file in the `output/` directory (created in the project root if it doesn't exist).
    *   Files are named in the format `langchain-agent-docs_INDEX.md`, where `INDEX` is the zero-based position of the URL in the processed list.
    *   The console will log the progress, including the URL being processed and the path to the saved Markdown file.

## Output Markdown Format

Each generated Markdown file will have the following structure