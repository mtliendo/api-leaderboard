'use client'

import { get, post, put, del } from 'aws-amplify/api'
import { withAuthenticator } from '@aws-amplify/ui-react'
import {
	AdminLeaderboardComponent,
	Player,
} from '@/components/admin-leaderboard'
import { useEffect, useState } from 'react'

export async function listPlayers() {
	try {
		const restOperation = get({
			apiName: 'playerAPI',
			path: 'players',
		})
		const response = await restOperation.response
		const body = await response.body.json()
		return body
	} catch (error) {
		console.log('GET call failed: ', error)
	}
}

async function addNewPlayer(player: Player) {
	console.log('the player ', player)
	put({
		apiName: 'playerAPI',
		path: 'players',
		options: {
			body: {
				...player,
			},
		},
	})
}

async function deletePlayerFunc(playerId: string) {
	console.log('the player id', playerId)
	try {
		const restOperation = del({
			apiName: 'playerAPI',
			path: `players`,
			options: {
				queryParams: {
					id: playerId,
				},
			},
		})
		const response = await restOperation.response
		const body = await response.statusCode
		console.log('Delete call succeeded: ', body)
	} catch (error) {
		console.log('Delete call failed: ', error)
	}
}

async function updatePlayer(updatedPlayerData: Player) {
	console.log('the updated player data', updatedPlayerData)
	try {
		const restOperation = post({
			apiName: 'playerAPI',
			path: 'players',
			options: {
				body: {
					id: updatedPlayerData.id,
					name: updatedPlayerData.name,
					score: updatedPlayerData.score,
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

function LeaderboardWithForm() {
	const [playerData, setPlayerData] = useState<Player[] | []>([])
	useEffect(() => {
		listPlayers()
			.then((data) => {
				setPlayerData(data as unknown as Player[])
			})
			.catch((error) => {
				console.log('error', error)
			})
	}, [])

	const handleCreatePlayer = async (newPlayer: Player) => {
		console.log('the player', newPlayer)
		const res = await addNewPlayer(newPlayer)
		console.log('the res', res)
	}

	const handleDeletePlayer = async (playerId: string) => {
		console.log('the player id', playerId)
		const res = await deletePlayerFunc(playerId)
		console.log('the res', res)
		return res
	}

	const handleUpdatePlayer = async (player: Player) => {
		console.log('the player', player)
		await updatePlayer(player)
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-center text-4xl my-10">Leaderboard Admin</h1>
			<div className="max-w-4xl mx-auto">
				<AdminLeaderboardComponent
					initialData={playerData}
					onCreatePlayer={handleCreatePlayer}
					onDeletePlayer={handleDeletePlayer}
					onUpdatePlayer={handleUpdatePlayer}
				/>
			</div>
		</div>
	)
}

export default withAuthenticator(LeaderboardWithForm)
