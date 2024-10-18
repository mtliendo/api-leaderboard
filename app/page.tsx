'use client'
import {
	LeaderboardTable,
	Player,
	UpdateScoreForm,
} from '@/components/leaderboard'
import { useState } from 'react'

// This page should pull the data from ddb on page load
// it should also setup a publisher
// it should

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
		setData((prevData) =>
			prevData.map((player) =>
				player.id === id ? { ...player, score: newScore } : player
			)
		)
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-4">
			<LeaderboardTable data={data} />
			<UpdateScoreForm data={data} onUpdateScore={handleUpdateScore} />
		</div>
	)
}
