import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PUT() {
	try {
		const users = await prisma.user.findMany({
			where: { role: { contains: "EMPLOYEE" } },
		});

		// Memperbarui token untuk setiap pengguna secara paralel
		const updatePromises = users.map((user) =>
			prisma.user.update({
				where: { userid: user.userid },
				data: { token: uuidv4() },
			})
		);

		// Tunggu semua operasi selesai
		const updatedUsers = await Promise.all(updatePromises);

		return NextResponse.json({
			status: 200,
			message: "Tokens updated successfully",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
