const { PrismaClient } = require("@prisma/client");
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
	await prisma.user.upsert({
		where: { email: "admin@mail.com" },
		update: {},
		create: {
			username: "admin",
			email: "admin@mail.com",
			password: md5("admin123"),
			sk_number: "-",
			no_telp: "6285155467000",
			name: "Admin",
			place: "Majalengka",
			date_of_birth: new Date("2003-02-24T00:00:00"),
			main_task: "-",
			education: "-",
			address: "-",
			token: uuidv4(),
			role: "ADMIN",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
