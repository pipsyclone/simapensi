import prisma from "@/libs/prisma";
import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		const data = await prisma.dailyReport.findMany({
			where: { userid },
		});
		const reportToday = await prisma.dailyReport.findFirst({
			where: {
				userid,
				date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
			},
		});
		return NextResponse.json({ status: 200, message: "OK", data, reportToday });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
