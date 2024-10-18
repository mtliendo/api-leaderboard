'use client'
import { LeaderboardTable, Player } from '@/components/leaderboard'
import React, { useEffect, useState } from 'react'

// fetch this from dynamodb
const initialData: Player[] = [
	{ id: 1, name: 'Alice', score: 100 },
	{ id: 2, name: 'Bob', score: 90 },
	{ id: 3, name: 'Charlie', score: 80 },
	{ id: 4, name: 'David', score: 70 },
	{ id: 5, name: 'Eve', score: 60 },
]

function LeaderboardPage() {
	const [data] = useState(initialData)

	useEffect(() => {
		//listen for changes and update the state with new data when it comes in.
	}, [])

	return (
		<div className="w-1/3 max-w-4xl mx-auto space-y-4">
			<LeaderboardTable data={data} />
		</div>
	)
}

export default LeaderboardPage
