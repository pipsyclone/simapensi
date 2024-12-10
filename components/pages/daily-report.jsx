"use client";
import { useState } from "react";
import Card from "@/components/ui/card";
import Scripts from "@/libs/scripts";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function DailyReport() {
	const { data: session } = useSession();
	const { handleAlert } = Scripts();
	const [isLoading, setIsLoading] = useState(false);

	const [desc, setDesc] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		if (desc === "") {
			handleAlert("warning", "Error Form!", "Form anda masih kosong!", false);
			setIsLoading(false);
		} else {
			await axios
				.post("/api/dailyreport/post/store-report", {
					userid: session?.user?.userid,
					desc,
				})
				.then((res) => {
					if (res.data.status === 200) {
						handleAlert("success", "Success!", res.data.message, false);
						setDesc("");
					} else {
						handleAlert("warning", "Warning!", res.data.message, false);
						setDesc("");
					}
				})
				.catch((err) => {
					handleAlert("error", "Server Error!", err.message, false);
					console.log(err.message);
				});
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-3">
					<label>Deskripsi : </label>
					<textarea
						rows={7}
						className="rounded-lg border border-indigo-500 focus:ring-2 focus:ring-indigo-500 ring-inset outline-0 p-2"
						placeholder="Silahkan tulis laporan harian anda disini..."
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					></textarea>
				</div>
				<button
					type="submit"
					className={
						isLoading
							? "disable bg-indigo-400 rounded-lg p-2 text-white ms-auto"
							: "bg-indigo-500 rounded-lg p-2 text-white ms-auto"
					}
					disabled={isLoading}
				>
					{isLoading ? "Mengirim..." : "Kirim"}
				</button>
			</form>
		</Card>
	);
}
