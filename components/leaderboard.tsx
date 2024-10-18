'use client'

import { useState, useMemo } from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
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

export type Player = {
	id: number
	name: string
	score: number
}

export function LeaderboardTable({ data }: { data: Player[] }) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'score', desc: true },
	])

	const sortedData = useMemo(() => {
		return [...data].sort((a, b) => b.score - a.score)
	}, [data])

	const columns: ColumnDef<Player>[] = [
		{
			accessorKey: 'rank',
			header: 'Rank',
			cell: ({ row }) => {
				const rank =
					sortedData.findIndex((player) => player.id === row.original.id) + 1
				return <div className="text-center min-w-[50px]">{rank}</div>
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
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="min-w-[100px]">{row.getValue('name')}</div>
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
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="text-right min-w-[50px]">{row.getValue('score')}</div>
			),
		},
	]

	const table = useReactTable({
		data: sortedData,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	})

	return (
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
											<motion.div layout>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</motion.div>
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
	)
}

export function UpdateScoreForm({
	data,
	onUpdateScore,
}: {
	data: Player[]
	onUpdateScore: (id: number, score: number) => void
}) {
	const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
	const [newScore, setNewScore] = useState<string>('')

	const handleScoreUpdate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const playerId = Number(selectedPlayerId)
		const score = Number(newScore)

		if (playerId && !isNaN(score)) {
			onUpdateScore(playerId, score)
			setNewScore('')
		}
	}

	return (
		<form onSubmit={handleScoreUpdate} className="space-y-4">
			<div className="flex space-x-4">
				<div className="flex-1 space-y-2">
					<Label htmlFor="player">Select Player</Label>
					<Select onValueChange={setSelectedPlayerId} value={selectedPlayerId}>
						<SelectTrigger className="bg-background">
							<SelectValue placeholder="Select a player" />
						</SelectTrigger>
						<SelectContent>
							{data.map((player) => (
								<SelectItem key={player.id} value={player.id.toString()}>
									{player.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex-1 space-y-2">
					<Label htmlFor="score">New Score</Label>
					<div className="space-y-2">
						<Input
							id="score"
							type="number"
							value={newScore}
							onChange={(e) => setNewScore(e.target.value)}
							required
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={!selectedPlayerId || !newScore}
						>
							Update Score
						</Button>
					</div>
				</div>
			</div>
		</form>
	)
}

// export function Leaderboard() {
// 	const [data, setData] = useState(initialData)

// 	const handleUpdateScore = (id: number, newScore: number) => {
// 		setData((prevData) =>
// 			prevData.map((player) =>
// 				player.id === id ? { ...player, score: newScore } : player
// 			)
// 		)
// 	}

// 	return (
// 		<div className="w-full max-w-4xl mx-auto space-y-4">
// 			<LeaderboardTable data={data} />
// 			<UpdateScoreForm data={data} onUpdateScore={handleUpdateScore} />
// 		</div>
// 	)
// }
