import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbProductRepository } from "src/repositories/dynamo-db/dynamo-db-product-repository";
import { ProductRepository } from "src/repositories/product-repository";
import { FetchProductsByTitle } from "src/use-cases/fetch-products-by-title";
import z, { ZodError } from "zod";

const FetchProductsByTitleSchema = z.object({
    query: z.string().nonempty(),
    page: z.coerce.number().default(1)
})

const productRepository: ProductRepository = new DynamoDbProductRepository()
const fetchProductsByTitle = new FetchProductsByTitle(productRepository)

exports.fetchProductsByTitle = async function(event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
    try {
        const {page,query} = FetchProductsByTitleSchema.parse(event.queryStringParameters || {})
        const {products} = await fetchProductsByTitle.execute({page,query})
        return {
            statusCode: 200,
            body: JSON.stringify({
                products
            })
        }
    } catch (error) {
        if(error instanceof ZodError){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Query misses on request"
                })
            }
        }

        return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Internal server error"
                })
            }
    }
}