'use client'

import { useState, useEffect } from 'react'
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export type Player = {
	id: string
	name: string
	score: number
}

type ViewOnlyLeaderboardProps = {
	initialData: Player[]
}

export default function ViewOnlyLeaderboard({
	initialData,
}: ViewOnlyLeaderboardProps) {
	const [data, setData] = useState<Player[]>([])
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'score', desc: true },
	])

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

	return (
		<div className="space-y-8">
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
		</div>
	)
}
