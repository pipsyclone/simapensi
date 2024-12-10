"use client";
import "@/styles/globals.css";
import { useEffect } from "react";

export default function MainLayout({ children }) {
	useEffect(() => {
		setInterval(() => {
			window.location.href = "/dashboard";
		}, 3000);
	}, []);
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
