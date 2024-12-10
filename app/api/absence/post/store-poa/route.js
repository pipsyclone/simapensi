import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";
import prisma from "@/libs/prisma";
import { endOfDay, startOfDay } from "date-fns";

export async function POST(request) {
	const formData = await request.formData();
	const userid = formData.get("userid");
	const file = formData.get("file");
	const description = formData.get("description");
	const now = new Date();
	const startDay = startOfDay(now);
	const endDay = endOfDay(now);

	try {
		if (!file) {
			return NextResponse.json({
				status: 400,
				message: "Tidak ada file yang di masukkan!",
			});
		}

		if (!description) {
			return NextResponse.json({
				status: 400,
				message: "Masukkan deskripsi minimal 1 karakter!",
			});
		}

		if (!CONFIG.ALLOWED_FILE_TYPE.includes(file.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tidak diizinkan, hanya JPG, JPEG, dan PNG!",
			});
		} else if (file.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file terlalu besar, tidak boleh lebih dari 2MB!",
			});
		}

		if (!fs.existsSync(CONFIG.DIRECTORY)) {
			fs.mkdirSync(CONFIG.DIRECTORY);
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const originalFilename = file.name;
		const extension = originalFilename.substring(
			originalFilename.lastIndexOf(".")
		);
		const filename = Date.now() + extension;

		const AbsenceExist = await prisma.absence.findFirst({
			where: {
				userid,
				lastdate: {
					gte: startDay,
					lte: endDay,
				},
			},
		});

		if (AbsenceExist && AbsenceExist.status === "HADIR") {
			return NextResponse.json({
				status: 203,
				message:
					"Anda sudah melakukan absensi, berarti anda tidak bisa mengirim bukti izin ketidak hadiran!",
			});
		}

		const alreadyPoa = await prisma.absence.findFirst({
			where: {
				userid,
				lastdate: { gte: startDay, lte: endDay },
				status: "IZIN",
			},
		});

		if (alreadyPoa) {
			return NextResponse.json({
				status: 203,
				message: "Anda sudah mengirimnya hari ini!",
			});
		}

		await writeFile(
			path.join(process.cwd(), CONFIG.DIRECTORY + filename),
			buffer
		);

		await prisma.absence.update({
			where: {
				absenceid: AbsenceExist.absenceid,
			},
			data: {
				status: "IZIN",
				description: description,
				file: filename,
			},
		});

		return NextResponse.json({
			status: 200,
			message:
				"Berhasil mengirim bukti izin ketidak hadiran, saat ini status anda izin!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
