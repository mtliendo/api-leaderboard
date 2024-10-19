import { defineFunction } from '@aws-amplify/backend'

export const updateLeaderboardFunc = defineFunction({
	name: 'updateLeaderboardFuncn',
	entry: './main.ts',
})
