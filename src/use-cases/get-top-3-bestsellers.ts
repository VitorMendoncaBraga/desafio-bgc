import { Categories } from "src/entities/product";
import { ProductRepository } from "src/repositories/product-repository";

interface GetTop3BestSellersRequest {
    category: Categories
}

export class GetTop3BestSellers{
    constructor(private productRepository: ProductRepository){}
    async execute({category} : GetTop3BestSellersRequest){
        const products = await this.productRepository.findTop3ByCategory(category)
        return products
    }
}