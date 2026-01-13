import { Categories } from "src/entities/product";
import { ProductRepository } from "src/repositories/product-repository";
import { ValidationError } from "./errors/validation-error";

interface GetTop3BestSellersRequest {
    category: Categories
}

export class GetTop3BestSellersByCategory{
    constructor(private productRepository: ProductRepository){}
    async execute({category} : GetTop3BestSellersRequest){
        if(!category){
            throw new ValidationError("The category is required")
        }
        const products = await this.productRepository.findTop3ByCategory(category)
        return products
    }
}