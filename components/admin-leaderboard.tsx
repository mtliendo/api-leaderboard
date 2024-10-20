'use client'

import { useEffect, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export type Player = {
	id: string
	name: string
	score: number
}

type AdminLeaderboardComponentProps = {
	initialData: Player[]
	onCreatePlayer: (newPlayer: Player) => void
	onDeletePlayer: (playerId: string) => void
	onUpdatePlayer: (player: Player) => void
}

export function AdminLeaderboardComponent({
	initialData,
	onCreatePlayer,
	onDeletePlayer,
	onUpdatePlayer,
}: AdminLeaderboardComponentProps) {
	const [data, setData] = useState<Player[]>(initialData)
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'score', desc: true },
	])
	const [newPlayerName, setNewPlayerName] = useState('')
	const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
	const [newScore, setNewScore] = useState<string>('')

	//this is needed so that the data in the table updates...I guess 🤷‍♂️
	useEffect(() => {
		setData(initialData)
	}, [initialData])

	const columns: ColumnDef<Player>[] = [
		{
			accessorKey: 'rank',
			header: 'Rank',
			cell: ({ row }) => {
				const sortedData = [...data].sort((a, b) => b.score - a.score)
				const rank =
					sortedData.findIndex((player) => player.id === row.original.id) + 1
				return <div className="text-center">{rank}</div>
			},
		},
		{
			accessorKey: 'name',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Name
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<Button
					variant="link"
					onClick={() => {
						onDeletePlayer(row.original.id)
						setData(data.filter((player) => player.id !== row.original.id))
					}}
				>
					{row.getValue('name')}
				</Button>
			),
		},
		{
			accessorKey: 'score',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Score
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
		},
	]

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	})

	const handleUpdatePlayer = (e: React.FormEvent) => {
		e.preventDefault()
		if (selectedPlayerId && newScore) {
			const updatedPlayer = data.find(
				(player) => player.id === selectedPlayerId
			)
			if (updatedPlayer) {
				const updatedPlayerData = {
					...updatedPlayer,
					score: parseInt(newScore, 10),
				}
				const updatedData = data.map((player) =>
					player.id === selectedPlayerId ? updatedPlayerData : player
				)
				setData(updatedData)
				setSelectedPlayerId('')
				setNewScore('')
				onUpdatePlayer(updatedPlayerData)
			}
		}
	}

	const handleAddPlayer = (e: React.FormEvent) => {
		e.preventDefault()
		if (newPlayerName) {
			const newPlayer: Player = {
				id: crypto.randomUUID(),
				name: newPlayerName,
				score: 0,
			}
			setData((prevData) => [...prevData, newPlayer])
			setNewPlayerName('')
			onCreatePlayer(newPlayer)
		}
	}

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>Update Player Score</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpdatePlayer} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="player-select">Select Player</Label>
								<Select
									value={selectedPlayerId}
									onValueChange={setSelectedPlayerId}
								>
									<SelectTrigger id="player-select">
										<SelectValue placeholder="Select a player" />
									</SelectTrigger>
									<SelectContent>
										{data.map((player) => {
											return (
												<SelectItem key={player.id} value={player.id}>
													{player.name}
												</SelectItem>
											)
										})}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="new-score">New Score</Label>
								<Input
									id="new-score"
									type="number"
									placeholder="Enter new score"
									value={newScore}
									onChange={(e) => setNewScore(e.target.value)}
								/>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={!selectedPlayerId || !newScore}
						>
							Update Score
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Leaderboard</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								<AnimatePresence initial={false}>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row) => (
											<motion.tr
												key={row.original.id}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}
												layout
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
											</motion.tr>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center"
											>
												No results.
											</TableCell>
										</TableRow>
									)}
								</AnimatePresence>
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Add New Player</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleAddPlayer} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="new-player-name">New Player Name</Label>
							<Input
								id="new-player-name"
								placeholder="Enter player name"
								value={newPlayerName}
								onChange={(e) => setNewPlayerName(e.target.value)}
							/>
						</div>
						<Button type="submit" className="w-full">
							Add Player
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
