import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const identifier = request.nextUrl.searchParams.get("identifier");

		const data = await prisma.user.findFirst({
			where: { OR: [{ userid: identifier }, { token: identifier }] },
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
