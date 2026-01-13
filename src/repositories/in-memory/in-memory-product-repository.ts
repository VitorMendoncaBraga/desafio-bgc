import { Categories, Product } from "src/entities/product";
import { ProductRepository } from "../product-repository";

export class InMemoryProductRepository implements ProductRepository {
    public items: Product[] = []
    async findTop3ByCategory(category: Categories): Promise<Product[]> {
        const result = this.items.filter((item) => item.category == category).slice(0,3)
        return result
    }
    async save(product: Product): Promise<void>{
        this.items.push(product)
    }
}