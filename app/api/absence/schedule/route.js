import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
	try {
		const datas = await prisma.user.findMany({
			where: {
				role: {
					not: "ADMIN", // Mengecualikan pengguna dengan role "admin"
				},
			},
			select: {
				userid: true, // Ambil userid
				// Tambahkan kolom lain yang perlu diambil di sini
			},
		});
		// Siapkan data untuk disalin
		const dataToCreate = datas.map(({ userid }) => ({
			// Hapus ID untuk menghindari konflik saat menyalin
			userid: userid,
			status: "TIDAK HADIR",
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
