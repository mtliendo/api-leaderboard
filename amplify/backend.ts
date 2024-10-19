import { updateLeaderboardFunc } from './functions/updateLeaderboard/resource'
import { listLeaderboardFunc } from './functions/listLeaderboard/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import {
	AuthorizationType,
	// CognitoUserPoolsAuthorizer,
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
	listLeaderboardFunc,
	updateLeaderboardFunc,
})

// create a dynamodb table
const leaderboardTable = new Table(backend.stack, 'LeaderboardTable', {
	partitionKey: { name: 'name', type: AttributeType.STRING },
	sortKey: { name: 'score', type: AttributeType.NUMBER },
})

backend.listLeaderboardFunc.addEnvironment(
	'LEADERBOARD_TABLENAME',
	leaderboardTable.tableName
)
backend.updateLeaderboardFunc.addEnvironment(
	'LEADERBOARD_TABLENAME',
	leaderboardTable.tableName
)

leaderboardTable.grantReadData(backend.listLeaderboardFunc.resources.lambda)
leaderboardTable.grantWriteData(backend.updateLeaderboardFunc.resources.lambda)

const leaderboardAPI = new RestApi(backend.stack, 'leaderboardAPI', {
	restApiName: 'leaderboardAPI',
	deployOptions: {
		stageName: 'dev',
	},
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
	},
})

// create a new Lambda integration
const listLeaderboardLambdaIntegration = new LambdaIntegration(
	backend.listLeaderboardFunc.resources.lambda
)

const postLeaderboardLambdaIntegration = new LambdaIntegration(
	backend.updateLeaderboardFunc.resources.lambda
)

// create a new Cognito User Pools authorizer
// const cognitoAuth = new CognitoUserPoolsAuthorizer(
// 	backend.stack,
// 	'CognitoAuth',
// 	{
// 		cognitoUserPools: [backend.auth.resources.userPool],
// 	}
// )

// create a new resource path with IAM authorization
const leaderboardPath = leaderboardAPI.root.addResource('leaderboard-players', {
	defaultMethodOptions: {
		authorizationType: AuthorizationType.IAM,
		// authorizer: cognitoAuth,
	},
})

// add methods to the /leaderboard resource path
leaderboardPath.addMethod('GET', listLeaderboardLambdaIntegration)
leaderboardPath.addMethod('POST', postLeaderboardLambdaIntegration)

// create a new IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(backend.stack, 'RestApiPolicy', {
	statements: [
		new PolicyStatement({
			actions: ['execute-api:Invoke'],
			resources: [
				`${leaderboardAPI.arnForExecuteApi(
					'GET',
					'/leaderboard-players',
					'dev'
				)}`,
				`${leaderboardAPI.arnForExecuteApi(
					'POST',
					'/leaderboard-players',
					'dev'
				)}`,
			],
		}),
	],
})

backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
	apiRestPolicy
)

// add outputs to the configuration file
backend.addOutput({
	custom: {
		API: {
			[leaderboardAPI.restApiName]: {
				endpoint: leaderboardAPI.url,
				region: Stack.of(leaderboardAPI).region,
				apiName: leaderboardAPI.restApiName,
			},
		},
	},
})
