'use client'

import React, { useEffect, useState } from 'react'
import ViewOnlyLeaderboard, { Player } from '@/components/leaderboard'
import { listPlayers } from './admin/page'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function LeaderboardPage() {
	const [leaderboardData, setLeaderboardData] = useState<Player[]>([])

	useEffect(() => {
		//listen for changes and update the state with new data when it comes in.
	}, [])

	useEffect(() => {
		listPlayers().then((data) => {
			setLeaderboardData(data as unknown as Player[])
		})
	}, [])

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Navbar />
			<main className="flex-grow container mx-auto px-4 py-8">
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-3xl font-bold text-center text-primary">
							Welcome to the Leaderboard
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-center text-muted-foreground">
							Track your progress and compete with others. May the best player
							win!
						</p>
					</CardContent>
				</Card>
				<div className="max-w-4xl mx-auto">
					<ViewOnlyLeaderboard initialData={leaderboardData} />
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default LeaderboardPage
