import DailyReport from "@/components/pages/daily-report";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "SIMAPENSI - Pengiriman Laporan Harian",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function DailyReportPage() {
	return <DailyReport />;
}
