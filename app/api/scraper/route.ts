import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTypes, Sequelize } from "sequelize";

const targetClass = "product-new-price";
const imageSrcTarget = "#product-gallery > div.ph-scroller > div > div:nth-child(1) > a > img";
const isOutOfStockTargetClass = ".label-out_of_stock";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/database.db",
});

const ScrapedData = sequelize.define('ScrapedData', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
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
        // const pageContent = await page.content();

        const price = await page.$$eval(`.${targetClass}`, (elements) => {
            return elements.map((element) => element.textContent);
        });

        //   Check availability
        // <span class="label label-out_of_stock">Stoc epuizat</span>
        let isOutOfStock: any = false;
        try {
            isOutOfStock = await page.$eval(isOutOfStockTargetClass, (element) => element?.textContent);
        } catch (err) {
            isOutOfStock = false;
        }

        const imageSrc = await page.$eval(imageSrcTarget, (img) => img.src);

        await browser.close();

        // Save data to SQLite database -------------------------------------------

        // If the database instance is not initialized, open the database connection
        // const db = await open({
        //     filename: "./collection.db", // Specify the database file path
        //     driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        // });

        // await db.exec(`
        //   CREATE TABLE IF NOT EXISTS scraped_data (
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     title TEXT,
        //     price TEXT,
        //     image TEXT,
        //     is_available INTEGER
        //   );
        // `);

        // const insertData = await db.prepare(`
        //   INSERT INTO scraped_data (title, price, image, is_available)
        //   VALUES (?, ?, ?, ?);
        // `);

        // await insertData.run(pageTitle, price[0], imageSrc, !isOutOfStock);
        // await insertData.finalize();
        // await db.close();

        await ScrapedData.sync();

        // Insert data into the table
        const scrapedData = await ScrapedData.create({
          title: pageTitle,
          price: price[0],
          image: imageSrc,
          is_available: !isOutOfStock,
        });


        return NextResponse.json(
            {
                // title: pageTitle,
                // price: price[0],
                // image: imageSrc,
                // isAvailable: !isOutOfStock,
                hello: scrapedData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during scraping:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
