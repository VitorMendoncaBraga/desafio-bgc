import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

import { Categories, Product } from "src/entities/product";
import { ProductRepository } from "../product-repository";

export class DynamoDbProductRepository implements ProductRepository {
    private readonly client: DynamoDBDocumentClient
    private readonly tableName = "ProdutosBestsellers"

    constructor() {
        const baseClient = new DynamoDBClient({})
        this.client = DynamoDBDocumentClient.from(baseClient)
    }

    async findTop3ByCategory(category: Categories): Promise<Product[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: "CategoryIndex",
            KeyConditionExpression: "category = :cat",
            ExpressionAttributeValues: {
                ":cat": category,
            },
            Limit: 3,
            ScanIndexForward: true,
        });

        const response = await this.client.send(command)
        return response.Items as Product[]
    }

    async findProductsByCategory(category: Categories, page: number): Promise<Product[]> {
        const NUMBER_ITEMS_PER_PAGE = 10;
        const limit = page * NUMBER_ITEMS_PER_PAGE;
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: "CategoryIndex",
            KeyConditionExpression: "category = :cat",
            ExpressionAttributeValues: {
                ":cat": category,
            },
            Limit: limit,
            ScanIndexForward: true,
        });

        const response = await this.client.send(command)
        return response.Items?.slice((page - 1) * NUMBER_ITEMS_PER_PAGE, page * NUMBER_ITEMS_PER_PAGE) as Product[]
    }

    async findManyByTitle(query: string, page: number): Promise<Product[]> {
        const NUMBER_ITEMS_PER_PAGE = 10
        const limit = page * NUMBER_ITEMS_PER_PAGE;
        const command = new ScanCommand({
            TableName: this.tableName,
        });

        const response = await this.client.send(command)
        const allItems = (response.Items || []) as Product[]
        const filteredItems = allItems.filter((item) => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        return filteredItems.splice((page - 1) * NUMBER_ITEMS_PER_PAGE, limit)
    }
}