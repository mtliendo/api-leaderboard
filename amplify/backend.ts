import { createPlayerFunc } from './functions/createPlayer/resource'
import { updatePlayersFunc } from './functions/updatePlayers/resource'
import { listPlayersFunc } from './functions/listPlayers/resource'
import { deletePlayerFunc } from './functions/deletePlayer/resource'
import { auth } from './auth/resource'
import { defineBackend } from '@aws-amplify/backend'
import {
	AuthorizationType,
	Cors,
	LambdaIntegration,
	RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Stack } from 'aws-cdk-lib'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	auth,
	listPlayersFunc,
	updatePlayersFunc,
	createPlayerFunc,
	deletePlayerFunc,
})

const apiWithFunctionsStack = Stack.of(backend.createPlayerFunc.stack)
const databaseStack = backend.createStack('DatabaseStack')
const playersTable = new Table(databaseStack, 'PlayersTable', {
	partitionKey: { name: 'id', type: AttributeType.STRING },
})

backend.listPlayersFunc.addEnvironment(
	'PLAYERS_TABLENAME',
	playersTable.tableName
)
backend.updatePlayersFunc.addEnvironment(
	'PLAYERS_TABLENAME',
	playersTable.tableName
)
backend.createPlayerFunc.addEnvironment(
	'PLAYERS_TABLENAME',
	playersTable.tableName
)
backend.deletePlayerFunc.addEnvironment(
	'PLAYERS_TABLENAME',
	playersTable.tableName
)

playersTable.grantReadData(backend.listPlayersFunc.resources.lambda)
playersTable.grantWriteData(backend.updatePlayersFunc.resources.lambda)
playersTable.grantWriteData(backend.createPlayerFunc.resources.lambda)
playersTable.grantWriteData(backend.deletePlayerFunc.resources.lambda)

const playersAPI = new RestApi(apiWithFunctionsStack, 'playersAPI', {
	restApiName: 'playerAPI',
	deployOptions: {
		stageName: 'dev',
	},
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
	},
})

// create a new Lambda integration
const listPlayerLambdaIntegration = new LambdaIntegration(
	backend.listPlayersFunc.resources.lambda
)

const postPlayerLambdaIntegration = new LambdaIntegration(
	backend.updatePlayersFunc.resources.lambda
)

const createPlayerLambdaIntegration = new LambdaIntegration(
	backend.createPlayerFunc.resources.lambda
)
const deletePlayerLambdaIntegration = new LambdaIntegration(
	backend.deletePlayerFunc.resources.lambda
)

// create a new resource path with IAM authorization
const playerPath = playersAPI.root.addResource('players', {
	defaultMethodOptions: {
		authorizationType: AuthorizationType.IAM,
	},
})

// add methods to the /player resource path
playerPath.addMethod('GET', listPlayerLambdaIntegration)
playerPath.addMethod('POST', postPlayerLambdaIntegration)
playerPath.addMethod('PUT', createPlayerLambdaIntegration)
playerPath.addMethod('DELETE', deletePlayerLambdaIntegration)

const apiUnauthPolicy = new Policy(apiWithFunctionsStack, 'apiUnauthPolicy', {
	statements: [
		new PolicyStatement({
			actions: ['execute-api:Invoke'],
			resources: [`${playersAPI.arnForExecuteApi('GET', '/players', 'dev')}`],
		}),
	],
})

const apiAuthPolicy = new Policy(apiWithFunctionsStack, 'apiAuthPolicy', {
	statements: [
		new PolicyStatement({
			actions: ['execute-api:Invoke'],
			resources: [
				`${playersAPI.arnForExecuteApi('GET', '/players', 'dev')}`,
				`${playersAPI.arnForExecuteApi('POST', '/players', 'dev')}`,
				`${playersAPI.arnForExecuteApi('PUT', '/players', 'dev')}`,
				`${playersAPI.arnForExecuteApi('DELETE', '/players', 'dev')}`,
				`${playersAPI.arnForExecuteApi('OPTIONS', '/players', 'dev')}`,
			],
		}),
	],
})

backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
	apiUnauthPolicy
)

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
	apiAuthPolicy
)

// add outputs to the configuration file
backend.addOutput({
	custom: {
		API: {
			[playersAPI.restApiName]: {
				endpoint: playersAPI.url,
				region: Stack.of(playersAPI).region,
				apiName: playersAPI.restApiName,
			},
		},
	},
})
