import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { env } from '$amplify/env/deletePlayerFunc'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandler = async (event) => {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers':
			'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
		'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
	}

	if (event.httpMethod === 'OPTIONS') {
		return { statusCode: 200, headers, body: '' }
	}

	try {
		const id = event.queryStringParameters?.id

		if (!id) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					message: 'Invalid input. Player ID is required as a query parameter.',
				}),
			}
		}

		const params = {
			TableName: env.PLAYERS_TABLENAME,
			Key: { id },
		}

		await docClient.send(new DeleteCommand(params))

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({ message: 'Player deleted successfully' }),
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
