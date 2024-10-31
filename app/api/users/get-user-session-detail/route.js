import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		const data = await prisma.user.findUnique({
			where: { userid: userid },
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
			data: data,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
