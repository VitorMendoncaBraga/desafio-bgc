import { Product } from "src/entities/product";
import { ProductRepository } from "src/repositories/product-repository";

interface FetchProductsByTitleRequest {
    query: string
    page: number
}

interface FetchProductsByTitleResponse {
    products: Product[]
}

export class FetchProductsByTitle {
    constructor(private productRepository: ProductRepository) { }

    async execute({ page, query }: FetchProductsByTitleRequest): Promise<FetchProductsByTitleResponse> {
        const products = await this.productRepository.findManyByTitle(query, page)
        return {
            products
        }
    }
}