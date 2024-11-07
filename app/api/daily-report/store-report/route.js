import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import prisma from "@/libs/prisma";

export async function POST(request) {
	try {
		const body = await request.json();
		const now = new Date();
		const startDay = startOfDay(now);
		const endDay = endOfDay(now);

		const alreadyDailyToday = await prisma.dailyReport.findFirst({
			where: {
				userid: body.userid,
				date: {
					gte: startDay,
					lte: endDay,
				},
			},
		});

		if (alreadyDailyToday) {
			return NextResponse.json({
				status: 203,
				message: "Anda sudah mengirim laporan hari ini!",
			});
		}

		await prisma.dailyReport.create({
			data: {
				userid: body.userid,
				description: body.desc,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil mengirim laporan harian!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
