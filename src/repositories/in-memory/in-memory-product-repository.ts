import { Categories, Product } from "src/entities/product";
import { ProductRepository } from "../product-repository";

export class InMemoryProductRepository implements ProductRepository {
    public items: Product[] = []
    async findTop3ByCategory(category: Categories): Promise<Product[]> {
        const result = this.items.filter((item) => item.category == category).slice(0,3)
        return result
    }

    async findProductsByCategory(category: Categories, page: number): Promise<Product[]> {
        const NUMBER_ITEMS_PER_PAGE = 10
        const result = this.items.filter((item) => item.category == category).slice((page - 1) * NUMBER_ITEMS_PER_PAGE, page * NUMBER_ITEMS_PER_PAGE)
        return result
    }

    async findManyByTitle(query: string, page: number): Promise<Product[]> {
        const NUMBER_ITEMS_PER_PAGE = 10
        const result = this.items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice((page - 1) * NUMBER_ITEMS_PER_PAGE, page * NUMBER_ITEMS_PER_PAGE)
        return result
    }

    async save(product: Product): Promise<void>{
        this.items.push(product)
    }

}