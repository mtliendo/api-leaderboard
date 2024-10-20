import { defineFunction } from '@aws-amplify/backend'

export const listPlayersFunc = defineFunction({
	name: 'listPlayersFunc',
	entry: './main.ts',
})
