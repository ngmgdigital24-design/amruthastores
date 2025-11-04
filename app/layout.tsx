import React from 'react'
import './globals.css'
import NavBar from './components/NavBar'

export const metadata = {
	title: 'Amrutha NextGen Stores',
	description: 'Amrutha NextGen Stores - Modern storefront',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-indigo-50 text-gray-900">
				<NavBar />

				{children}
				{/* client navbar handles cart badge; no inline scripts for SSR */}
			</body>
		</html>
	);
}
