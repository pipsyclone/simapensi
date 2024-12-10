import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";

export async function POST(request) {
	try {
		const body = await request.json();
		const usernameExist = await prisma.user.findUnique({
			where: {
				username: body.username,
			},
		});
		const emailExist = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});
		const skNumberExist = await prisma.user.findUnique({
			where: {
				sk_number: body.skNumber,
			},
		});
		const noTelpExist = await prisma.user.findUnique({
			where: {
				no_telp: body.noTelp,
			},
		});

		if (usernameExist) {
			return NextResponse.json({
				status: 400,
				message: "Username pegawai sudah tersedia!",
			});
		}

		if (emailExist) {
			return NextResponse.json({
				status: 400,
				message: "Email pegawai sudah tersedia!",
			});
		}

		if (skNumberExist) {
			return NextResponse.json({
				status: 400,
				message: "Nomor SK sudah tersedia!",
			});
		}

		if (noTelpExist) {
			return NextResponse.json({
				status: 400,
				message: "Nomor Telp sudah tersedia!",
			});
		}

		await prisma.user.create({
			data: {
				username: body.username,
				email: body.email,
				password: md5(body.password),
				sk_number: body.skNumber,
				no_telp: body.noTelp,
				name: body.name,
				place: body.bornPlace,
				date_of_birth: new Date(body.dateOfBirth),
				main_task: body.mainTasks,
				education: body.education,
				address: body.address,
				token: uuidv4(),
				role: body.role,
			},
		});
		return NextResponse.json({
			status: 200,
			message: "Data Berhasil Dimasukkan!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}