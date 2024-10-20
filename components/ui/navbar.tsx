'use client'

import Link from 'next/link'
import { Home, Trophy, Settings } from 'lucide-react'

export function Navbar() {
	return (
		<nav className="bg-primary text-primary-foreground shadow-md">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="flex items-center space-x-2">
						<Trophy className="h-6 w-6 text-yellow-400" />
						<span className="font-bold text-lg ">Leaderboard</span>
					</Link>
					<div className="flex space-x-4">
						<Link
							href="/admin"
							className="flex items-center space-x-1 hover:text-green-500"
						>
							<Settings className="h-4 w-4" />
							<span>Admin</span>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
