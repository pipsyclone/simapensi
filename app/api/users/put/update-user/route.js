import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import md5 from "md5";
import { v4 as uuidv4 } from "uuid";

export async function PUT(request) {
	try {
		const body = await request.json();

		const existingUser = await prisma.user.findUnique({
			where: {
				userid: body.userid, // Asumsikan `userid` adalah primary key
			},
		});

		if (!existingUser) {
			return NextResponse.json({
				status: 404,
				message: "Data pengguna tidak ditemukan!",
			});
		}

		// Cek jika `username` sudah digunakan oleh pengguna lain
		if (
			body.username !== existingUser.username &&
			(await prisma.user.findFirst({
				where: {
					username: body.username,
					userid: { not: body.userid },
				},
			}))
		) {
			return NextResponse.json({
				status: 400,
				message: "Username pegawai sudah digunakan pengguna lain!",
			});
		}

		// Cek jika `email` sudah digunakan oleh pengguna lain
		if (
			body.email !== existingUser.email &&
			(await prisma.user.findFirst({
				where: {
					email: body.email,
					userid: { not: body.userid },
				},
			}))
		) {
			return NextResponse.json({
				status: 400,
				message: "Email pegawai sudah digunakan pengguna lain!",
			});
		}

		// Cek jika `sk_number` sudah digunakan oleh pengguna lain
		if (
			body.skNumber !== existingUser.sk_number &&
			(await prisma.user.findFirst({
				where: {
					sk_number: body.skNumber,
					userid: { not: body.userid },
				},
			}))
		) {
			return NextResponse.json({
				status: 400,
				message: "Nomor SK sudah digunakan pengguna lain!",
			});
		}

		// Cek jika `no_telp` sudah digunakan oleh pengguna lain
		if (
			body.noTelp !== existingUser.no_telp &&
			(await prisma.user.findFirst({
				where: {
					no_telp: body.noTelp,
					userid: { not: body.userid },
				},
			}))
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
