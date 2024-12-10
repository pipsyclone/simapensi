"use client";
import { useState } from "react";
import Card from "@/components/ui/card";
import Scripts from "@/libs/scripts";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PoA() {
	const { data: session } = useSession();
	const { handleAlert } = Scripts();
	const [isLoading, setIsLoading] = useState(false);

	const [selectedFile, setSelectedFile] = useState(null);
	const [description, setDescription] = useState("");

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleSending = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (!selectedFile || !description) {
			handleAlert(
				"warning",
				"Warning!",
				"Silahkan isi form dengan benar!",
				false
			);
			setIsLoading(false);
		} else {
			const formData = new FormData();
			formData.append("userid", session?.user?.userid);
			formData.append("file", selectedFile);
			formData.append("description", description);

			await axios
				.post("/api/absence/post/store-poa", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((res) => {
					if (res.data.status === 200) {
						handleAlert("success", "Success!", res.data.message, false);
						setSelectedFile(null);
						setDescription("");
					} else if (res.data.status === 203) {
						handleAlert("warning", "Warning!", res.data.message, false);
						setSelectedFile(null);
						setDescription("");
					} else {
						handleAlert("error", "Error!", res.data.message, false);
					}

					console.log(res.data);
					setIsLoading(false);
				})
				.catch((err) => {
					handleAlert("error", "Error!", err.message, false);
					console.log(err.message);
					setIsLoading(false);
				});
		}
	};

	return (
		<Card>
			<form onSubmit={handleSending} className="flex flex-col gap-5">
				<div className="flex flex-col gap-3">
					<label>
						Masukkan Bukti Izin Berupa Foto Selfie / Surat Dinas / Surat
						Keterangan Sakit :
					</label>
					<input
						type="file"
						accept="image/*"
						className="rounded-lg outline-0 border border-indigo-500 focus:ring-2 foucs:ring-indigo-500 ring-inset p-2"
						onChange={handleFileChange}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label>Keterangan :</label>
					<textarea
						rows={7}
						className="rounded-lg outline-0 border border-indigo-500 focus:ring-2 foucs:ring-indigo-500 ring-inset p-2"
						placeholder="Tulis keterangan anda izin disini..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
				</div>
				<button
					className="bg-indigo-500 rounded-lg text-white p-2 ms-auto disabled:bg-indigo-400"
					disabled={isLoading}
				>
					{isLoading ? "Mengirim..." : "Kirim"}
				</button>
			</form>
		</Card>
	);
}
