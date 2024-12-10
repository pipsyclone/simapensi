import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "Masuk ke SIMAPENSI",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
