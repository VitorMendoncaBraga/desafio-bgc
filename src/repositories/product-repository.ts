import { Product } from "src/entities/product";

export interface ProductRepository {
    findTop3ByCategory(category: string) : Promise<Product[]>
}