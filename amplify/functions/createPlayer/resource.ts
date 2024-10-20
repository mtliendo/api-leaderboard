import { defineFunction } from '@aws-amplify/backend'

export const createPlayerFunc = defineFunction({
	name: 'createPlayerFunc',
	entry: './main.ts',
})
