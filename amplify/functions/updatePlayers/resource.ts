import { defineFunction } from '@aws-amplify/backend'

export const updatePlayersFunc = defineFunction({
	name: 'updatePlayerFunc',
	entry: './main.ts',
})
