import Users from "@/components/pages/users";

export const metadata = {
	icons: {
		icon: "/favico.png",
	},
	title: "SIMAPENSI - List Pengguna",
	description: "Sistem Manajemen Pegawai dan Absensi",
};

export default function UsersPage() {
	return <Users />;
}
