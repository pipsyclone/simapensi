"use client";
import Card from "@/components/card";
import CardDetail from "@/components/card-detail";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
	const [dataUsers, setDataUsers] = useState([]);
	const getUsers = async () => {
		await axios.get("/api/users/get-users").then((res) => {
			setDataUsers(res.data.data);
		});
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<>
			<div className="flex flex-col sm:flex-row gap-3 mb-5">
				<CardDetail
					title="Jumlah Pegawai Non ASN"
					data={dataUsers.length}
					borderColor="border-green-500"
					footerText={"Jumlah Pegawai Terdaftar " + dataUsers.length}
				/>
				<CardDetail
					title="Jumlah Pegawai"
					data={100}
					borderColor="border-red-500"
				/>
				<CardDetail
					title="Jumlah Pegawai"
					data={100}
					borderColor="border-sky-500"
				/>
				<CardDetail
					title="Jumlah Pegawai"
					data={100}
					borderColor="border-blue-500"
				/>
			</div>
			<Card>Hello World</Card>
		</>
	);
}
