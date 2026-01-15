import { InMemoryProductRepository } from 'src/repositories/in-memory/in-memory-product-repository'
import { describe, test, beforeEach, expect } from 'vitest'
import { GetAllBestSellersByCategory } from './get-all-bestsellers-by-category'
import { Product } from 'src/entities/product'
import { randomUUID } from 'node:crypto'

let inMemoryProductRepository: InMemoryProductRepository
let sut: GetAllBestSellersByCategory

beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    sut = new GetAllBestSellersByCategory(inMemoryProductRepository)
})

describe("Get bestsellers by category", () => {
    test("it should be able to get the bestsellers by category", async () => {
        for (let i = 0; i < 31; i++) {
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

        const page = 1

        const productsResponse = await inMemoryProductRepository.findProductsByCategory('books', page)
        expect(productsResponse).toHaveLength(10)

    })

     test("it should be able to get pagineted bestsellers by category", async () => {
        for (let i = 0; i < 31; i++) {
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

        const page = 2

        const productsResponse = await inMemoryProductRepository.findProductsByCategory('books', page)
        expect(productsResponse).toHaveLength(10)

    })
})