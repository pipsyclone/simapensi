import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(request) {
	try {
		const body = await request.json();
		const { userid } = body;
		const now = new Date();
		const startDay = startOfDay(now);
		const endDay = endOfDay(now);

		// Konversi waktu sekarang ke zona waktu Jakarta (WIB)
		const waktuSekarang = new Date(
			now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
		);

		// Waktu batas untuk pagi dan sore
		const batasWaktuPagiMulai = new Date(waktuSekarang);
		batasWaktuPagiMulai.setHours(7, 0, 0, 0); // 07:00:00 WIB

		const batasWaktuPagiSelesai = new Date(waktuSekarang);
		batasWaktuPagiSelesai.setHours(8, 0, 0, 0); // 08:00:00 WIB

		const batasWaktuSoreMulai = new Date(waktuSekarang);
		batasWaktuSoreMulai.setHours(16, 0, 0, 0); // 16:00:00 WIB

		const batasWaktuSoreSelesai = new Date(waktuSekarang);
		batasWaktuSoreSelesai.setHours(17, 0, 0, 0); // 17:00:00 WIB

		// Validasi waktu absen
		const isWaktuPagi =
			waktuSekarang >= batasWaktuPagiMulai &&
			waktuSekarang <= batasWaktuPagiSelesai;
		const isWaktuSore =
			waktuSekarang >= batasWaktuSoreMulai &&
			waktuSekarang <= batasWaktuSoreSelesai;

		const absenceExist = await prisma.absence.findFirst({
			where: {
				userid,
				lastdate: {
					gte: startDay,
					lte: endDay,
				},
			},
		});

		const alreadyAbsenceToday = await prisma.absence.findFirst({
			where: {
				userid,
				lastdate: {
					gte: startDay,
					lte: endDay,
				},
				description: "Kehadiran Pagi dan Sore",
			},
		});

		if (alreadyAbsenceToday) {
			return NextResponse.json({
				status: 203,
				message: "Maaf anda sudah melakukannya hari ini!",
			});
		} else if (isWaktuPagi) {
			const alreadyMorningAbsence = await prisma.absence.findFirst({
				where: {
					userid,
					datemorning: {
						gte: batasWaktuPagiMulai,
						lte: batasWaktuPagiSelesai,
					},
				},
			});

			if (alreadyMorningAbsence) {
				return NextResponse.json({
					status: 203,
					message: "Maaf anda sudah melakukannya pagi hari ini!",
				});
			}

			await prisma.absence.update({
				where: {
					absenceid: alreadyMorningAbsence.absenceid,
					status: "TIDAK HADIR",
				},
				data: {
					datemorning: new Date(),
					status: "HADIR",
					description: "Kehadiran Pagi",
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil absen pada pagi hari ini!",
			});
		} else if (isWaktuSore) {
			const alreadyAfternoonAbsence = await prisma.absence.findFirst({
				where: {
					userid,
					dateafternoon: {
						gte: batasWaktuSoreMulai,
						lte: batasWaktuSoreSelesai,
					},
				},
			});

			if (alreadyAfternoonAbsence) {
				return NextResponse.json({
					status: 203,
					message: "Maaf anda sudah melakukannya sore hari ini!",
				});
			}

			const notAbsenMorning = await prisma.absence.findFirst({
				where: {
					userid,
					dateafternoon: {
						gte: batasWaktuPagiMulai,
						lte: batasWaktuSoreSelesai,
					},
					status: "HADIR",
				},
			});

			if (!notAbsenMorning) {
				return NextResponse.json({
					status: 203,
					message:
						"Maaf anda tidak bisa absen, karena tidak absen pagi hari ini!",
				});
			}

			await prisma.absence.update({
				where: {
					absenceid: absenceExist.absenceid,
				},
				data: {
					dateafternoon: new Date(),
					description: "Kehadiran Pagi dan Sore",
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil absen pada sore hari ini!",
			});
		} else {
			return NextResponse.json({
				status: 400,
				message: "Sistem menutup absen, tidak dapat melakukan absensi!",
			});
		}
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
