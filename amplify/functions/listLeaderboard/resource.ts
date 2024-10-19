import { defineFunction } from '@aws-amplify/backend'

export const listLeaderboardFunc = defineFunction({
	name: 'listLeaderboardFunc',
	entry: './main.ts',
})
