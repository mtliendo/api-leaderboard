'use client'
import ViewOnlyLeaderboard, { Player } from '@/components/leaderboard'
import React, { useEffect, useState } from 'react'
import { listPlayers } from './admin/page'

function LeaderboardPage() {
	const [leaderboardData, setLeaderboardData] = useState<Player[] | []>([])

	useEffect(() => {
		//listen for changes and update the state with new data when it comes in.
	}, [])

	useEffect(() => {
		listPlayers().then((data) => {
			setLeaderboardData(data as unknown as Player[])
		})
	}, [])

	return (
		<div className="container mx-auto py-10">
			<div className="max-w-4xl mx-auto">
				<ViewOnlyLeaderboard initialData={leaderboardData} />
			</div>
		</div>
	)
}

export default LeaderboardPage
