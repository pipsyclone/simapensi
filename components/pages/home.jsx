"use client";
import Card from "@/components/ui/card";
import CardDetail from "@/components/ui/card-detail";
import { useSession } from "next-auth/react";
import {
	getAbsenceByUser,
	getAbsences,
	getDailyReport,
	getUsers,
} from "@/libs/custom-swr";

export default function Home() {
	const { data: session } = useSession();
	const { dataUsers } = getUsers();
	const { dataNoAbsence, dataPermissionAbsence, loadingAbsences } =
		getAbsences();
	const { dataStatusAbsence, loadingAbsenceByUser } = getAbsenceByUser(
		session?.user?.userid
	);
	const { dataReportStatus, loadingDailyReport } = getDailyReport(
		session?.user?.userid
	);

	return (
		<>
			{session?.user?.role === "ADMIN" ? (
				<div className="flex flex-col sm:flex-row gap-3 mb-5">
					<CardDetail
						title="Jumlah Pegawai Non ASN"
						data={loadingAbsences ? "Loading..." : dataUsers?.length}
						borderColor="border-green-500"
						footerText={"Jumlah Pegawai Terdaftar " + dataUsers?.length || 0}
					/>
					<CardDetail
						title="Tidak Hadir Hari Ini"
						data={loadingAbsences ? "Loading..." : dataNoAbsence}
						borderColor="border-red-500"
						footerText={"Jumlah Pegawai Tidak Absen : " + dataNoAbsence}
					/>
					<CardDetail
						title="Izin Hari Ini"
						data={loadingAbsences ? "Loading..." : dataPermissionAbsence}
						borderColor="border-orange-500"
						footerText={"Jumlah Pegawai Izin : " + dataPermissionAbsence}
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
							{loadingAbsenceByUser && loadingDailyReport ? (
								<span className="text-sky-500 italic">
									<i className="fa-solid fa-spinner animate-spin"></i>{" "}
									Loading...
								</span>
							) : dataStatusAbsence === "pagi" ? (
								<span className="text-green-500">
									<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
									Absensi Pada Pagi Hari Ini!
								</span>
							) : dataStatusAbsence === "pagidansore" ? (
								<span className="text-green-500">
									<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
									Absensi Pada Hari Ini!
								</span>
							) : dataStatusAbsence === "izin" ? (
								<span className="text-orange-500">
									<i className="fa-solid fa-warning"></i> Anda Sudah Melakukan
									Izin Pada Hari Ini!
								</span>
							) : dataStatusAbsence === "tidakhadir" ? (
								<span className="text-red-500">
									<i className="fa-solid fa-times"></i> Anda Belum Melakukan
									Absensi Pada Hari Ini!
								</span>
							) : (
								<span className="text-red-500">
									<i className="fa-solid fa-times"></i> Data Tidak Valid!
								</span>
							)}

							{loadingAbsenceByUser && loadingDailyReport ? (
								""
							) : dataReportStatus === "sudahmengirim" ? (
								<span className="text-green-500">
									<i className="fa-solid fa-check"></i> Anda Sudah Melakukan
									Pengiriman Laporan Hari Ini!
								</span>
							) : (
								<span className="text-red-500">
									<i className="fa-solid fa-times"></i> Anda Belum Melakukan
									Pengiriman Laporan Hari Ini!
								</span>
							)}
						</div>
					</>
				) : (
					""
				)}
			</Card>
		</>
	);
}
