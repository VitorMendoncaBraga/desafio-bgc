import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDbProductRepository } from 'src/repositories/dynamo-db/dynamo-db-product-repository';
import { ProductRepository } from 'src/repositories/product-repository';
import { GetAllBestSellersByCategory } from 'src/use-cases/get-all-bestsellers-by-category';
import z, { ZodError } from 'zod'

const GetAllBestSellersByCategoryQuerySchema = z.object({
    page: z.coerce.number().default(1)
})
const GetAllBestSellersByCategoryParamsSchema = z.object({
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

const productRepository: ProductRepository = new DynamoDbProductRepository()
const getAllBestSellersByCategoryUseCase = new GetAllBestSellersByCategory(productRepository)

exports.getAllBestSellersByCategory = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { page } = GetAllBestSellersByCategoryQuerySchema.parse(event.queryStringParameters || {})
        const { category } = GetAllBestSellersByCategoryParamsSchema.parse(event.pathParameters)

        const { products } = await getAllBestSellersByCategoryUseCase.execute({ page, query: category })

        return {
            statusCode: 200,
            body: JSON.stringify({
                products
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Error of parameters validation",
                    message: error
                })
            }
        }

        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Internal server error",
                message: error
            })
        }
    }
}