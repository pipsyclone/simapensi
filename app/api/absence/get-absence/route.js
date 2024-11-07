import prisma from "@/libs/prisma";
import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const now = new Date();
		const startDay = startOfDay(now);
		const endDay = endOfDay(now);

		const dataNoAbsence = await prisma.absence.findMany({
			where: {
				lastdate: {
					gte: startDay,
					lte: endDay,
				},
				status: "TIDAK HADIR",
			},
		});

		const dataAbsence = await prisma.absence.findMany({
			where: {
				lastdate: {
					gte: startDay,
					lte: endDay,
				},
				status: "IZIN",
			},
		});
		return NextResponse.json({
			status: 200,
			message: "OKE",
			datanoabsence: dataNoAbsence,
			dataabsence: dataAbsence,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
