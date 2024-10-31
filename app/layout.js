import AuthProvider from "@/context/AuthProviders";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
	title: "SIMAPENSI - Dinas Lingkungan Hidup Majalengka",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function MainLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en">
				<body>{children}</body>
			</html>
		</AuthProvider>
	);
}
