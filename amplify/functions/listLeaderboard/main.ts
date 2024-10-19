import type { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { env } from '$amplify/env/listLeaderboardFunc'

// Create DynamoDB client
const dbClient = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(dbClient)

export const handler: APIGatewayProxyHandler = async () => {
	try {
		// Scan the DynamoDB table
		const command = new ScanCommand({ TableName: env.LEADERBOARD_TABLENAME })
		const data = await docClient.send(command)

		// Return the items from the scan
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
				'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
			},
			body: JSON.stringify(data.Items),
		}
	} catch (error) {
		console.error('Error fetching data:', error)
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
				'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
			},
			body: JSON.stringify({ message: 'Error fetching data' }),
		}
	}
}
