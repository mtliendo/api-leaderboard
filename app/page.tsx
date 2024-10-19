'use client'
import {
	LeaderboardTable,
	Player,
	UpdateScoreForm,
} from '@/components/leaderboard'
import { useState } from 'react'
import { get, post } from 'aws-amplify/api'

// This page should pull the data from ddb on page load
// it should also setup a publisher
// it should

import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'

Amplify.configure(outputs)
const existingConfig = Amplify.getConfig()
Amplify.configure({
	...existingConfig,
	API: {
		...existingConfig.API,
		REST: outputs.custom.API,
	},
})
// this should come from dynamodb
const initialData: Player[] = [
	{ id: 1, name: 'Alice', score: 100 },
	{ id: 2, name: 'Bob', score: 90 },
	{ id: 3, name: 'Charlie', score: 80 },
	{ id: 4, name: 'David', score: 70 },
	{ id: 5, name: 'Eve', score: 60 },
]
export default function LeaderboardWithForm() {
	const [data, setData] = useState(initialData)

	const handleUpdateScore = (id: number, newScore: number) => {
		//this should call api gateway and save the data to dynamodb
		setData((prevData) =>
			prevData.map((player) =>
				player.id === id ? { ...player, score: newScore } : player
			)
		)
	}

	async function listPlayers() {
		try {
			const restOperation = get({
				apiName: 'leaderboardAPI',
				path: 'leaderboard-players',
			})
			const response = await restOperation.response
			const body = await response.body.json()
			console.log('GET call succeeded: ', body)
		} catch (error) {
			console.log('GET call failed: ', error)
		}
	}

	async function postItem() {
		try {
			const restOperation = post({
				apiName: 'leaderboardAPI',
				path: 'leaderboard-players',
				options: {
					body: {
						name: 'John Doe',
						score: 50,
					},
				},
			})

			const response = await restOperation.response
			const body = await response.body.json()
			console.log('Post call succeeded: ', body)
		} catch (error) {
			console.log('Post call failed: ', error)
		}
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-4">
			<button onClick={() => listPlayers()}>listPlayers</button>
			<button onClick={() => postItem()}>postPlayers</button>
			<LeaderboardTable data={data} />
			<UpdateScoreForm data={data} onUpdateScore={handleUpdateScore} />
		</div>
	)
}
