import { InMemoryProductRepository } from 'src/repositories/in-memory/in-memory-product-repository'
import { describe, test, beforeEach, expect } from 'vitest'
import { GetTop3BestSellersByCategory } from './get-top-3-bestsellers-by-category'
import { Product } from 'src/entities/product'
import { randomUUID } from 'node:crypto'

let inMemoryProductRepository: InMemoryProductRepository
let sut: GetTop3BestSellersByCategory

beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    sut = new GetTop3BestSellersByCategory(inMemoryProductRepository)
})

describe("Get top 3 bestsellers by category", () => {
    test("it should be able to get the top 3 best sellers by category", async () => {
        for (let i = 0; i < 6; i++) {
            const newProduct = Product.create({
                category: 'books',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ ${i + 10},00`,
                ranking: i + 1,
                title: `title-${i + 1}-example`
            })

            await inMemoryProductRepository.save(newProduct)
        }

        const productsResponse = await inMemoryProductRepository.findTop3ByCategory('books')
        expect(productsResponse).toHaveLength(3)
    })
})