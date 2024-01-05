import puppeteer from 'puppeteer';
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
    const { searchPrompt } = await request.json();

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(searchPrompt, { waitUntil: 'domcontentloaded' });

        // Add your scraping logic here
        const pageTitle = await page.title();
        const pageContent = await page.content();

        await browser.close();

        return NextResponse.json({ title: pageTitle, content: pageContent }, { status: 200 });
    } catch (error) {
        console.error('Error during scraping:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}