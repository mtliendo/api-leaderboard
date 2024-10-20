// components/ConfigureAmplify.tsx
'use client'

import { Amplify } from 'aws-amplify'

import outputs from '@/amplify_outputs.json'
Amplify.configure(outputs)
const existingConfig = Amplify.getConfig()
Amplify.configure(
	{
		...existingConfig,
		API: {
			...existingConfig.API,
			REST: outputs.custom.API,
		},
	},
	{ ssr: true }
)

export default function ConfigureAmplifyClientSide() {
	return null
}
