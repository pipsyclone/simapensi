import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const token = request.nextUrl.searchParams.get("token");
		const userid = request.nextUrl.searchParams.get("userid");

		let data;

		// Prioritaskan token terlebih dahulu, jika tidak ada gunakan userid
		if (token) {
			const dataByToken = await prisma.user.findUnique({
				where: { token: token },
			});

			if (dataByToken) {
				data = dataByToken;
			}
		} else if (userid) {
			const dataByUserid = await prisma.user.findUnique({
				where: { userid: userid },
			});

			if (dataByUserid) {
				data = dataByUserid;
			}
		}

		if (data) {
			return NextResponse.json({
				status: 200,
				message: "OK",
				data: data,
			});
		} else {
			return NextResponse.json({
				status: 404,
				message: "Data not found",
				data: null,
			});
		}
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
