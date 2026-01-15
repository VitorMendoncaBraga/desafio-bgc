import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDbProductRepository } from "src/repositories/dynamo-db/dynamo-db-product-repository"
import { ProductRepository } from "src/repositories/product-repository"
import { ValidationError } from "src/use-cases/errors/validation-error"
import { GetTop3BestSellersByCategory } from "src/use-cases/get-top-3-bestsellers-by-category"
import z, { ZodError } from "zod"

const productRepository: ProductRepository = new DynamoDbProductRepository()
const getTop3BestSellersByCategoryUseCase = new GetTop3BestSellersByCategory(productRepository)

const GetTop3BestSellersByCategoryQuerySchema = z.object({
    category: z.enum([
        'books',
        'fashion',
        'kitchen',
        'home',
        'appliances',
        'electronics',
        'sports',
        'videogames',
        'furniture',
        'pet-products'
    ])
})


exports.getTop3BestSellersByCategory = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { category } = GetTop3BestSellersByCategoryQuerySchema.parse(event.queryStringParameters)
        const products = await getTop3BestSellersByCategoryUseCase.execute({ category })
        return {
            statusCode: 200,
            body: JSON.stringify({
                products
            })
        }
    } catch (error) {
        if (error instanceof ZodError || error instanceof ValidationError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Invalid category query"
                })
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Internal server error",
                message: error
            })
        }
    }
}