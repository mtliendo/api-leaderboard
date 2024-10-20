'use client'

export function Footer() {
	return (
		<footer className="bg-secondary text-secondary-foreground mt-auto">
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<p>&copy; 2024 Made with ❤️ by Focus Otter. All rights reserved.</p>
					<div className="mt-4 md:mt-0">
						<a href="#" className="hover:text-primary-foreground mr-4">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-primary-foreground">
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
