import Home from "@/components/pages/home";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "SIMAPENSI - Dinas Lingkungan Hidup Majalengka",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function DashboardHome() {
	return <Home />;
}
