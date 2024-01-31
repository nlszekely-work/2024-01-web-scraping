import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { DataTypes, Sequelize } from "sequelize";

const targetClass = "product-new-price";
const imageSrcTarget = "#product-gallery > div.ph-scroller > div > div:nth-child(1) > a > img";
const isOutOfStockTargetClass = ".label-out_of_stock";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/database.db",
});

const ScrapedData = sequelize.define("ScrapedData", {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

export async function POST(request: Request, response: Response) {
    const { searchPrompt } = await request.json();

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(searchPrompt, { waitUntil: "domcontentloaded" });

        // Add your scraping logic here
        const pageTitle = await page.title();

        const price = await page.$$eval(`.${targetClass}`, (elements) => {
            return elements.map((element) => element.textContent);
        });

        let isOutOfStock: any = false;
        try {
            isOutOfStock = await page.$eval(isOutOfStockTargetClass, (element) => element?.textContent);
        } catch (err) {
            isOutOfStock = false;
        }

        const imageSrc = await page.$eval(imageSrcTarget, (img) => img.src);

        await browser.close();

        // Init db connection
        await ScrapedData.sync();

        // Insert data into the table
        const scrapedData = await ScrapedData.create({
            url: searchPrompt,
            title: pageTitle,
            price: price[0],
            image: imageSrc,
            is_available: !isOutOfStock,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            scrapedData,
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during scraping:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


