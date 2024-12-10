"use client";
import { useState, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Card from "@/components/ui/card";
import axios from "axios";
import Scripts from "@/libs/scripts";
import { useSession } from "next-auth/react";
import { getUsers } from "@/libs/custom-swr";
import { mutate } from "swr";

export default function Users() {
	const { data: session } = useSession();
	const { handleAlert } = Scripts();
	const { dataUsers, loadingUsers } = getUsers();

	const handleDelete = async (userid) => {
		await axios
			.delete("/api/users/delete/by-user?userid=" + userid)
			.then((res) => {
				handleAlert("success", "Berhasil Menghapus!", res.data.message, false);
				mutate("/api/users/get/all");
			});
	};

	const actionButton = (rowData) => {
		return (
			<div className="flex gap-3">
				<button
					className="bg-green-500 p-2 rounded-lg text-white text-xs hover:bg-green-400 duration-500 ease-in-out"
					onClick={() =>
						(window.location.href = "/dashboard/users/view/" + rowData.userid)
					}
				>
					Lihat
				</button>
				{session?.user?.userid === rowData.userid ? (
					""
				) : (
					<button
						className="bg-red-500 p-2 rounded-lg text-white text-xs hover:bg-red-400 duration-500 ease-in-out"
						onClick={() => handleDelete(rowData.userid)}
					>
						Hapus
					</button>
				)}
			</div>
		);
	};

	const [filterText, setFilterText] = useState("");
	const filteredItems = dataUsers?.filter(
		(item) =>
			(item.name &&
				item.name.toLowerCase().includes(filterText.toLowerCase())) ||
			(item.email &&
				item.email.toLowerCase().includes(filterText.toLowerCase())) ||
			(item.sk_number &&
				item.sk_number.toLowerCase().includes(filterText.toLowerCase()))
	);
	const subHeaderComponentMemo = useMemo(() => {
		return (
			<div className="flex justify-between items-center">
				<h1>Data Pengguna</h1>
				<input
					type="text"
					className="ms-auto border rounded-lg p-2 w-[100px] sm:w-[300px] outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset text-sm"
					placeholder="Cari Disini..."
					value={filterText}
					onChange={(e) => setFilterText(e.target.value)}
				/>
			</div>
		);
	}, [filterText]);

	return (
		<Card>
			{loadingUsers ? (
				<div className="text-center italic mt-3">Loading...</div>
			) : (
				<DataTable
					value={filteredItems}
					header={subHeaderComponentMemo}
					paginator
					rows={10}
					rowsPerPageOptions={[10, 25, 50]}
					showGridlines
					tableStyle={{
						minWidth: "50rem",
						fontSize: "9pt",
					}}
					className="custom-table"
					virtualScrollerOptions={{ itemSize: 46 }}
				>
					<Column field="name" header="Nama Pegawai"></Column>
					<Column field="email" header="Email"></Column>
					<Column field="sk_number" header="Nomor SK"></Column>
					<Column field="main_task" header="Tugas Pokok"></Column>
					<Column body={actionButton} header="Aksi"></Column>
				</DataTable>
			)}
		</Card>
	);
}
