
import puppeteer from 'puppeteer';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const categories = [
    { nome: 'Books', slug: 'books', url: 'https://www.amazon.com.br/gp/bestsellers/books' },
    { nome: 'Fashion', slug: 'fashion', url: 'https://www.amazon.com.br/gp/bestsellers/fashion' },
    { nome: 'Kitchen', slug: 'kitchen', url: 'https://www.amazon.com.br/gp/bestsellers/kitchen' },
    { nome: 'Home', slug: 'home', url: 'https://www.amazon.com.br/gp/bestsellers/home' },
    { nome: 'Appliences', slug: 'appliances', url: 'https://www.amazon.com.br/gp/bestsellers/appliances' },
    { nome: 'Electronics', slug: 'electronics', url: 'https://www.amazon.com.br/gp/bestsellers/electronics' },
    { nome: 'Sports', slug: 'sports', url: 'https://www.amazon.com.br/gp/bestsellers/sports' },
    { nome: 'Videogames', slug: 'videogames', url: 'https://www.amazon.com.br/gp/bestsellers/videogames' },
    { nome: 'Furniture', slug: 'furniture', url: 'https://www.amazon.com.br/gp/bestsellers/furniture' },
    { nome: 'Pet-products', slug: 'pet-products', url: 'https://www.amazon.com.br/gp/bestsellers/pet-products' },
];

async function runScrapper() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    for (let category of categories) {
        await page.goto(category.url, {
            waitUntil: 'networkidle2'
        })
        await page.waitForSelector('#gridItemRoot');

        const extractedProducts = await page.evaluate((slugCategory) => {
            const cards = Array.from(document.querySelectorAll('#gridItemRoot'));
            return cards.map((card, index) => {
                const titleEl = card.querySelector('div[class*="_p13n-sc-css-line-clamp-"]');
                const priceEl = card.querySelector('.p13n-sc-price') || card.querySelector('span.a-color-price');
                const imgEl = card.querySelector('img.a-dynamic-image');
                const linkEl = card.querySelector('a.a-link-normal');

                return {
                    title: titleEl ? titleEl.textContent?.trim() : 'no title',
                    price: priceEl ? priceEl.textContent?.trim() : 'sold out',
                    image: imgEl ? (imgEl as HTMLImageElement).src : '',
                    link: linkEl ? 'https://www.amazon.com.br' + linkEl.getAttribute('href') : '',
                    ranking: index + 1,
                    category: slugCategory
                };
            });
        }, category.slug)

        const readyProducts = extractedProducts.map(p => ({
            id: `${p.title}-${p.category}`,
            ...p,
            dataScraping: new Date().toISOString()
        }));


        for (let product of readyProducts) {
            try {
                await docClient.send(new PutCommand({
                    TableName: 'ProdutosBestsellers',
                    Item: product
                })); 
            } catch (error) {
                console.log(error)
                console.log('Error saving a product')
            }
        }




        console.log(readyProducts)
    }
}

runScrapper()