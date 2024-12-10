import Register from "@/components/pages/register";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "SIMAPENSI - Daftarkan akun pegawai",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function RegisterPage() {
	return <Register />;
}
