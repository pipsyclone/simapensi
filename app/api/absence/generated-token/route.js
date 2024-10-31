import { v4 as uuidv4 } from "uuid";

export async function GET() {
	try {
		await prisma.user.updateMany({
			where: { role: { contains: "EMPLOYEE" } },
			data: { token: uuidv4() },
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
