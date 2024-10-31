import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
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

		const alreadyAbsences = await prisma.absence.findMany({
			where: { userid },
		});

		if (isWaktuPagi) {
			if (alreadyAbsences.length > 0) {
				const alreadyAbsenceToday = await prisma.absence.findFirst({
					where: {
						userid,
						date: {
							gte: startDay,
							lte: endDay,
						},
						amount: 1,
					},
				});

				if (!alreadyAbsenceToday) {
					return NextResponse.json({
						status: 203,
						message: "Maaf anda sudah melakukannya pagi hari ini!",
					});
				}
			}

			await prisma.absence.update({
				where: {
					date: {
						get: startDay,
						lte: endDay,
					},
				},
				data: { status: "HADIR", description: "Kehadiran Pagi", amount: 1 },
			});

			await prisma.user.update({
				where: { userid: userid },
				data: {
					token: uuidv4(),
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil absen pada pagi hari ini!",
			});
		} else if (isWaktuSore) {
			if (alreadyAbsences.length > 0) {
				const alreadyAbsenceToday = await prisma.absence.findFirst({
					where: {
						userid,
						date: {
							gte: startDay,
							lte: endDay,
						},
						amount: 2,
					},
				});

				if (!alreadyAbsenceToday) {
					return NextResponse.json({
						status: 203,
						message: "Maaf anda sudah melakukannya sore hari ini!",
					});
				}
			}

			await prisma.absence.update({
				where: {
					date: {
						get: startDay,
						lte: endDay,
					},
				},
				data: {
					status: "HADIR",
					description: "Kehadiran Pagi dan Sore",
					amount: 2,
				},
			});

			await prisma.user.update({
				where: { userid: userid },
				data: {
					token: uuidv4(),
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
