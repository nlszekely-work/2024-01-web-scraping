import puppeteer from 'puppeteer';
import { NextResponse } from "next/server";

const targetClass = "product-new-price"
const imageSrcTarget = "#product-gallery > div.ph-scroller > div > div:nth-child(1) > a > img"
const isOutOfStockTargetClass = ".label-out_of_stock";

export async function POST(request: Request, response: Response) {
    const { searchPrompt } = await request.json();

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(searchPrompt, { waitUntil: 'domcontentloaded' });

        // Add your scraping logic here
        const pageTitle = await page.title();
        // const pageContent = await page.content();

        const price = await page.$$eval(`.${targetClass}`, elements => {
            return elements.map(element => element.textContent);
        });

        //   Check availability
        // <span class="label label-out_of_stock">Stoc epuizat</span>
        let isOutOfStock: any = false
        try {
            isOutOfStock = await page.$eval(isOutOfStockTargetClass, element => element?.textContent);
        } catch (err) {
            isOutOfStock = false
        }

        const imageSrc = await page.$eval(imageSrcTarget, img => img.src);

        await browser.close();

        return NextResponse.json({
            title: pageTitle, price: price[0],
            image: imageSrc, isAvailable: !isOutOfStock
        }, { status: 200 });
    } catch (error) {
        console.error('Error during scraping:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}