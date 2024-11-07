import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import md5 from "md5";
import { v4 as uuidv4 } from "uuid";

export async function PUT(request) {
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

		if (
			usernameExist !== null &&
			usernameExist.userid !== body.userid &&
			usernameExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Username pegawai sudah digunakan pengguna lain!",
			});
		}

		if (
			emailExist !== null &&
			emailExist.userid !== body.userid &&
			emailExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Email pegawai sudah digunakan pengguna lain!",
			});
		}

		if (
			skNumberExist !== null &&
			skNumberExist.userid !== body.userid &&
			skNumberExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Nomor SK sudah digunakan pengguna lain!",
			});
		}

		if (
			noTelpExist !== null &&
			noTelpExist.userid !== body.userid &&
			noTelpExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Nomor Telp sudah digunakan pengguna lain!",
			});
		}

		await prisma.user.update({
			where: { userid: body.userid },
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
			message: "Data Berhasil Diperbarui!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
