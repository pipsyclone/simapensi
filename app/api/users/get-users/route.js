import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.user.findMany({
			where: {
				role: {
					not: "ADMIN", // Mengecualikan pengguna dengan role "admin"
				},
			},
		});
		return NextResponse.json({ status: 200, message: "OK", data: data });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
