import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

import AuthProvider from "@/context/AuthProvider";
import Dashboard from "@/components/pages/template";

export default function DashboardLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en">
				<body>
					<Dashboard content={children} />
				</body>
			</html>
		</AuthProvider>
	);
}
