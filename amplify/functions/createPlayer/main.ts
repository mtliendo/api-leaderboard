import { APIGatewayProxyHandler } from './../../../node_modules/@types/aws-lambda/trigger/api-gateway-proxy.d'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { env } from '$amplify/env/createPlayerFunc'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandler = async (event) => {
	// CORS headers
	const headers = {
		'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
		'Access-Control-Allow-Headers':
			'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
		'Access-Control-Allow-Methods': 'OPTIONS,PUT',
	}

	// Handle preflight request
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers,
			body: '',
		}
	}

	try {
		const body = JSON.parse(event.body!)
		const { name, score = 0, id } = body

		if (!name || typeof score !== 'number') {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					message:
						'Invalid input. Name (string) and score (number) are required.',
				}),
			}
		}

		const playerId = id || uuidv4()

		const params = {
			TableName: env.PLAYERS_TABLENAME,
			Item: {
				id: playerId,
				name,
				score,
			},
		}

		await docClient.send(new PutCommand(params))

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				message: 'Player added successfully',
				payload: {
					id: playerId,
					name,
					score,
				},
			}),
		}
	} catch (error) {
		console.error('Error:', error)
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ message: 'Internal server error', error }),
		}
	}
}
