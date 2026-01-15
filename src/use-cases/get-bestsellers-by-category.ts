import { Categories, Product } from "src/entities/product";
import { ProductRepository } from "src/repositories/product-repository";

interface GetBestSellersByCategoryRequest {
    query: Categories,
    page: number
}

interface GetBestSellersByCategoryResponse {
    products: Product[]
}

export class GetBestSellersByCategory {
    constructor(private productRepository: ProductRepository){}

    async execute({page,query}: GetBestSellersByCategoryRequest) : Promise<GetBestSellersByCategoryResponse>{
        const products = await this.productRepository.findProductsByCategory(query, page)
        return {
            products
        }
    }
}