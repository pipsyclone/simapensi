import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST() {
	try {
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
