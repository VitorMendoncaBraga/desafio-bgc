import { Categories, Product } from "src/entities/product";

export interface ProductRepository {
    findTop3ByCategory(category: Categories) : Promise<Product[]>
    findProductsByCategory(category: Categories, page: number): Promise<Product[]>
    findManyByTitle(query: string, page: number) : Promise<Product[]>
}