import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
	const session = await getToken({ req });
	const { pathname } = req.nextUrl;

	// Jika pengguna belum login dan mencoba mengakses halaman yang membutuhkan autentikasi (/dashboard)
	if (!session && pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/auth", req.url));
	}

	// Jika pengguna sudah login dan mencoba mengakses halaman login (/auth/signin)
	if (session) {
		if (pathname.startsWith("/auth")) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		if (
			session.role === "EMPLOYEE" &&
			pathname.startsWith("/dashboard/users/register")
		) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}
}

// Tentukan rute yang diproteksi
export const config = {
	matcher: ["/", "/auth", "/dashboard/:path*", "/dashboard/users/:path*"], // Pastikan middleware hanya aktif di rute tertentu
};
