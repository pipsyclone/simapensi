import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		await prisma.user.delete({
			where: { userid },
		});
		return NextResponse.json({
			status: 200,
			message: "Data Berhasil Dihapus!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
