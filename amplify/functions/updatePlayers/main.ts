import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy'
// Import required AWS SDK clients and commands
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { env } from '$amplify/env/updatePlayersFunc'

// Create DynamoDB client
const dbClient = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(dbClient)

// Define the handler for the Lambda function
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		// Parse the incoming event body
		const body = JSON.parse(event.body!)
		const { name, score, id } = body

		// Validate input data
		if (
			!name ||
			typeof name !== 'string' ||
			!score ||
			typeof score !== 'number'
		) {
			return {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
					'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
				},
				body: JSON.stringify({
					message:
						'Invalid input: name must be a string and score must be a number.',
				}),
			}
		}

		// Prepare the item to be added
		const item = { name, score, id }

		// Put the item into the DynamoDB table
		const command = new PutCommand({
			TableName: env.PLAYERS_TABLENAME,
			Item: item,
		})

		await docClient.send(command)

		// Return a success response
		return {
			statusCode: 201,
			headers: {
				'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
				'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
			},
			body: JSON.stringify({ message: 'Item added successfully', item }),
		}
	} catch (error) {
		console.error('Error adding item:', error)
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
				'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
			},
			body: JSON.stringify({ message: 'Error adding item' }),
		}
	}
}
