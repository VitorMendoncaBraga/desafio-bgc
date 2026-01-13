import { Categories, Product } from "src/entities/product";

export interface ProductRepository {
    findTop3ByCategory(category: Categories) : Promise<Product[]>
}