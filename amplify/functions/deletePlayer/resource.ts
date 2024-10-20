import { defineFunction } from '@aws-amplify/backend'

export const deletePlayerFunc = defineFunction({
	name: 'deletePlayerFunc',
	entry: './main.ts',
})
