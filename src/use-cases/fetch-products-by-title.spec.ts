import { InMemoryProductRepository } from 'src/repositories/in-memory/in-memory-product-repository'
import { describe, test, beforeEach, expect } from 'vitest'
import { FetchProductsByTitle } from './fetch-products-by-title'
import { Product } from 'src/entities/product'
import { randomUUID } from 'node:crypto'

let inMemoryProductRepository: InMemoryProductRepository
let sut: FetchProductsByTitle

beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    sut = new FetchProductsByTitle(inMemoryProductRepository)
})

describe("Fetch products by title", () => {
    test("it should be able to fetch products by title", async () => {
        for (let i = 0; i < 5; i++) {
            const newProduct = Product.create({
                category: 'books',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ ${i + 10},00`,
                ranking: i + 1,
                title: `book-example-${i + 1}`
            })

            await inMemoryProductRepository.save(newProduct)
        }

        const newProduct = Product.create({
                category: 'fashion',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ 110,00`,
                ranking: 5,
                title: `fashion-dress`
            })

            await inMemoryProductRepository.save(newProduct)

        const page = 1

        const productsResponse = await inMemoryProductRepository.findManyByTitle('book', page)
        expect(productsResponse).toHaveLength(5)

    })

    test("it should be able to fetch products by title independent of category", async () => {
        for (let i = 0; i < 5; i++) {
            const newProduct = Product.create({
                category: 'books',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ ${i + 10},00`,
                ranking: i + 1,
                title: `book-example-${i + 1}-green`
            })

            await inMemoryProductRepository.save(newProduct)
        }

        const newProduct = Product.create({
                category: 'fashion',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ 110,00`,
                ranking: 5,
                title: `fashion-dress-green`
            })

            await inMemoryProductRepository.save(newProduct)

        const page = 1

        const productsResponse = await inMemoryProductRepository.findManyByTitle('green', page)
        expect(productsResponse).toHaveLength(6)

    })

    test("it should be able to fetch pagineted products by title independent of category", async () => {
        for (let i = 0; i < 11; i++) {
            const newProduct = Product.create({
                category: 'books',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ ${i + 10},00`,
                ranking: i + 1,
                title: `book-example-${i + 1}-green`
            })

            await inMemoryProductRepository.save(newProduct)
        }

        const newProduct = Product.create({
                category: 'fashion',
                dataScraping: new Date().toISOString(),
                id: randomUUID(),
                image: "image-link-example",
                link: "link-example",
                price: `R$ 110,00`,
                ranking: 5,
                title: `fashion-dress-green`
            })

            await inMemoryProductRepository.save(newProduct)

        const page = 2

        const productsResponse = await inMemoryProductRepository.findManyByTitle('green', page)
        expect(productsResponse).toHaveLength(2)

    })

    
})