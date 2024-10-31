"use client";
import { useEffect } from "react";

export default function Index() {
	useEffect(() => {
		setInterval(() => {
			window.location.href = "/dashboard";
		}, 3000);
	}, []);

	return (
		<div className="relative w-full h-[100vh] bg-indigo-500">
			<div className="absolute w-[200px] md:w-[400px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-center">
				Redirecting...
			</div>
		</div>
	);
}
