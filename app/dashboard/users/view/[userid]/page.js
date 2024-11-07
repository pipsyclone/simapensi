import ViewUser from "@/components/view-user";

export const metadata = {
	icons: {
		icon: "./favico.png",
	},
	title: "Informasi Data Pegawai",
	description: "Informasi data pegawai secara detail",
};

export default function ViewUserPage() {
	return <ViewUser />;
}
