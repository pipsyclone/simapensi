import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "SIMAPENSI - Dinas Lingkungan Hidup Majalengka",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function MainLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
