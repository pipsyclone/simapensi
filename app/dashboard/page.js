"use client";
import Card from "@/components/card";
import CardDetail from "@/components/card-detail";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Dashboard() {
	const { data: session } = useSession();
	const [dataUsers, setDataUsers] = useState([]);
	const getUsers = async () => {
		await axios.get("/api/users/get-users").then((res) => {
			setDataUsers(res.data.data);
		});
	};

	const [dataAbsences, setDataAbsences] = useState([]);
	const getAbsences = async (userid) => {
		await axios
			.get("/api/absence/get-absences-by-userid?userid=" + userid)
			.then((res) => {
				setDataAbsences(res.data.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const [dataDaily, setDataDaily] = useState([]);
	const getDailyReport = async (userid) => {
		await axios
			.get("/api/daily-report/get-report-by-userid?userid=" + userid)
			.then((res) => {
				setDataDaily(res.data.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const [dataNoAbsence, setDataNoAbsence] = useState([]);
	const [dataAbsence, setDataAbsence] = useState([]);
	const getNoAbsence = async () => {
		await axios
			.get("/api/absence/get-absence")
			.then((res) => {
				setDataNoAbsence(res.data.datanoabsence);
				setDataAbsence(res.data.dataabsence);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		getUsers();
		getAbsences(session?.user?.userid);
		getDailyReport(session?.user?.userid);
		getNoAbsence();
	}, [session]);

	return (
		<>
			{session?.user?.role === "ADMIN" ? (
				<div className="flex flex-col sm:flex-row gap-3 mb-5">
					<CardDetail
						title="Jumlah Pegawai Non ASN"
						data={dataUsers.length}
						borderColor="border-green-500"
						footerText={"Jumlah Pegawai Terdaftar " + dataUsers.length}
					/>
					<CardDetail
						title="Tidak Hadir Hari Ini"
						data={dataNoAbsence.length}
						borderColor="border-red-500"
						footerText={"Jumlah Pegawai Tidak Absen : " + dataNoAbsence.length}
					/>
					<CardDetail
						title="Izin Hari Ini"
						data={dataAbsence.length}
						borderColor="border-orange-500"
						footerText={"Jumlah Pegawai Izin : " + dataAbsence.length}
					/>
					<CardDetail
						title="Jumlah Pegawai"
						data={100}
						borderColor="border-blue-500"
					/>
				</div>
			) : (
				""
			)}
			<Card>
				<div className="text-2xl font-bold">
					Selamat Datang di Dashboard Pegawai
				</div>
				<p>
					Ini adalah aplikasi pegangan pegawai untuk melakukan pelaporan, izin
					kerja, dan absensi.
				</p>
				{session?.user?.role === "EMPLOYEE" ? (
					<>
						<br />
						<br />
						<p>Apa yang ada belum dan sudah lakukan hari ini ?</p>
						<div className="flex flex-col ga-5">
							{dataAbsences.map((data, key) => {
								if (
									data.userid === session?.user?.userid &&
									new Date(data.lastdate).toDateString() ===
										new Date().toDateString() &&
									data.status === "HADIR" &&
									data.description === "Kehadiran Pagi"
								) {
									return (
										<span className="text-green-500">
											<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
											Absensi Pada Pagi Hari Ini!
										</span>
									);
								} else if (
									data.userid === session?.user?.userid &&
									new Date(data.lastdate).toDateString() ===
										new Date().toDateString() &&
									data.status === "HADIR" &&
									data.description === "Kehadiran Pagi dan Sore"
								) {
									return (
										<span className="text-green-500">
											<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
											Absensi Pada Hari Ini!
										</span>
									);
								} else if (
									data.userid === session?.user?.userid &&
									new Date(data.lastdate).toDateString() ===
										new Date().toDateString() &&
									data.status === "IZIN"
								) {
									return (
										<span className="text-orange-500">
											<i className="fa-solid fa-warning"></i> Anda Sudah
											Melakukan Izin Pada Hari Ini!
										</span>
									);
								} else {
									return (
										<span className="text-red-500">
											<i className="fa-solid fa-times"></i> Anda Belum Melakukan
											Absensi Pada Hari Ini!
										</span>
									);
								}
							})}

							{dataDaily.map((data, key) => {
								if (
									data.userid === session?.user?.userid &&
									new Date(data.date).toDateString() ===
										new Date().toDateString()
								) {
									return (
										<span className="text-green-500">
											<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
											Pengiriman Laporan Hari Ini!
										</span>
									);
								} else {
									return (
										<span className="text-red-500">
											<i className="fa-solid fa-times"></i> Anda Belum Melakukan
											Pengiriman Laporan Hari Ini!
										</span>
									);
								}
							})}
						</div>
					</>
				) : (
					""
				)}
			</Card>
		</>
	);
}
