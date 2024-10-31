import AuthProvider from "@/context/AuthProviders";
import Dashboard from "@/components/dashboard";

export default function DashboardLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en">
				<body className="bg-stone-100">
					<Dashboard content={children} />
				</body>
			</html>
		</AuthProvider>
	);
}
