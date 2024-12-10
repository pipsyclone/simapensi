import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		// Periksa apakah hari ini adalah Minggu
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

		if (dayOfWeek === 0) {
			return NextResponse.json({
				status: 400,
				message: "Hari minggu tidak ada update absensi!",
			});
		}

		const datas = await prisma.user.findMany({
			where: { role: { contains: "EMPLOYEE" } },
			select: {
				userid: true, // Ambil userid
				// Tambahkan kolom lain yang perlu diambil di sini
			},
		});

		// Siapkan data untuk disalin
		const dataToCreate = datas.map(({ userid }) => ({
			// Hapus ID untuk menghindari konflik saat menyalin
			userid: userid,
		}));

		// Buat salinan pengguna
		await prisma.absence.createMany({
			data: dataToCreate,
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
