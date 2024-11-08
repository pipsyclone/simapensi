import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Scripts from "@/assets/scripts";
import md5 from "md5";

// Fungsi untuk mengonversi tanggal dari dd/mm/yyyy ke ISO string
function convertExcelDate(serial) {
	const startDate = new Date(1900, 0, 1); // Excel's "day 1" is 1 Jan 1900
	const msInDay = 86400000; // Milliseconds in one day
	const resultDate = new Date(startDate.getTime() + (serial - 2) * msInDay); // Subtract 2 because of Excel date handling
	console.log(resultDate); // Log the result to check
	return resultDate;
}

// Fungsi untuk mengonversi tanggal dari dd/mm/yyyy ke ISO string
function convertToISO(dateString) {
	const [day, month, year] = dateString.split("/");
	return new Date(`${year}-${month}-${day}`).toISOString();
}

export async function POST(request) {
	try {
		const { uniqid } = Scripts();
		const body = await request.json();

		const formatedData = body.data
			.map((data, i) => {
				const date_of_birth = convertExcelDate(data.date_of_birth);
				if (isNaN(date_of_birth)) {
					return null;
				}

				return {
					username: uniqid(8, "minimalis-number"),
					email: data.email,
					password: uniqid(8, "minimalis-number"),
					sk_number: data.sk_number,
					no_telp: "62" + uniqid(12, "number"),
					name: data.name,
					place: data.place,
					date_of_birth: date_of_birth,
					main_task: data.main_task,
					education: data.education,
					address: data.address,
					token: uuidv4(),
				};
			})
			.filter((data) => data !== null);

		// Upsert each item individually
		for (const data of formatedData) {
			await prisma.user.upsert({
				where: {
					email: data.email, // or another unique identifier like sk_number
				},
				update: {
					password: md5(data.password), // Fields to update if the record exists
					name: data.name,
					place: data.place,
					date_of_birth: data.date_of_birth,
					main_task: data.main_task,
					education: data.education,
					address: data.address,
					no_telp: data.no_telp,
					token: data.token,
				},
				create: {
					username: data.username,
					email: data.email,
					password: data.password,
					sk_number: data.sk_number,
					no_telp: data.no_telp,
					name: data.name,
					place: data.place,
					date_of_birth: data.date_of_birth,
					main_task: data.main_task,
					education: data.education,
					address: data.address,
					token: data.token,
				},
			});
		}

		return NextResponse.json({
			status: 200,
			message: "OK",
			data: formatedData,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
