import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.absence.findMany();
		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
