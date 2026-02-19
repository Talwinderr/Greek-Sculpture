'use client'

import * as Nav from '@/components/Nav'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { useState } from 'react'

const cera = localFont({
	src: [
		{
			path: './fonts/Cera-Pro-Regular.woff2',
			weight: '400'
		},
		{
			path: './fonts/Cera-Pro-Medium.woff2',
			weight: '500'
		}
	],
	variable: '--font-cera'
})


export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<html lang="en" className={`relative scroll-smooth bg-black text-white ${cera.variable}`}>
			<head>
				<title>Nova by Tally</title>
			</head>
			<body
				className="~header-py-6/12"
				style={{ '--header-h': 'calc(var(--header-py) * 2 + 1.375rem)' } as any}
			>
				<Guides />
				<header className="fixed top-0 z-10 w-full py-[--header-py]">
					<div className="grid-guides container flex items-center justify-between gap-4 md:grid">
						<h1 className="font-serif text-xl tracking-wide">Nova by Tally</h1>
						<Nav.Root className="col-span-3 max-md:hidden">
							<Nav.Item active={true}>Home</Nav.Item>
							<Nav.Item>Image Generation</Nav.Item>
							<Nav.Item>Video Generation</Nav.Item>
							<Nav.Item>UX/UI Design</Nav.Item>
							<Nav.Item>AI Automation</Nav.Item>
							<Nav.Item>About Me</Nav.Item>
						</Nav.Root>
						<button
							className="justify-self-end transition-opacity hover:opacity-70"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu"
						>
							<svg
								width="22"
								height="22"
								viewBox="0 0 22 22"
								fill="none"
								className="size-[1.375rem]"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="4" height="4" fill="#D9D9D9" />
								<rect x="9" width="4" height="4" fill="#D9D9D9" />
								<rect x="18" width="4" height="4" fill="#D9D9D9" />
								<rect y="9" width="4" height="4" fill="#D9D9D9" />
								<rect x="9" y="9" width="4" height="4" fill="#D9D9D9" />
								<rect x="18" y="9" width="4" height="4" fill="#D9D9D9" />
								<rect y="18" width="4" height="4" fill="#D9D9D9" />
								<rect x="9" y="18" width="4" height="4" fill="#D9D9D9" />
								<rect x="18" y="18" width="4" height="4" fill="#D9D9D9" />
							</svg>
						</button>
					</div>
				</header>

				{mobileMenuOpen && (
					<div
						className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
						onClick={() => setMobileMenuOpen(false)}
					>
						<div className="container flex h-full items-center justify-center">
							<nav className="text-center">
								<ul className="space-y-8">
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											Home
										</button>
									</li>
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest transition-colors hover:text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											Image Generation
										</button>
									</li>
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest transition-colors hover:text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											Video Generation
										</button>
									</li>
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest transition-colors hover:text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											UX/UI Design
										</button>
									</li>
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest transition-colors hover:text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											AI Automation
										</button>
									</li>
									<li>
										<button
											className="text-2xl font-medium uppercase tracking-widest transition-colors hover:text-blue-400"
											onClick={() => setMobileMenuOpen(false)}
										>
											About Me
										</button>
									</li>
								</ul>
							</nav>
							<button
								className="absolute right-8 top-8 text-4xl font-light text-white transition-opacity hover:opacity-70"
								onClick={() => setMobileMenuOpen(false)}
								aria-label="Close menu"
							>
								×
							</button>
						</div>
					</div>
				)}

				{children}
			</body>
		</html>
	)
}

function Guides() {
	return (
		<div className="pointer-events-none fixed inset-0 z-50 size-full">
			<div className="grid-guides container relative grid h-full max-guides-4:~px-6/8">
				<div className="border-r border-white/10 max-guides-4:border-l"></div>
				<div className="border-r border-white/10"></div>
				<div className="border-r border-white/10 max-guides-4:hidden"></div>
				<div className="border-r border-white/10 max-guides-5:hidden"></div>
			</div>
		</div>
	)
}
