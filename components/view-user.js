"use client";
import Card from "./card";
import Image from "next/image";
import UserImage from "@/assets/images/user.png";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Scripts from "@/assets/scripts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import ChartAbsences from "./charts/chart-absences";
import Modal from "./modal";

const ViewUser = () => {
	const params = useParams();
	const { handleAlert, uniqid } = Scripts();
	const [isLoading, setIsLoading] = useState(false);
	const [menuData, setMenuData] = useState("pegawai");

	const [data, setData] = useState([]);
	const [dataAbsences, setDataAbsences] = useState([]);
	const [dataDailyReport, setDataDailyReport] = useState([]);

	const [userid] = useState(params.userid);
	const [name, setName] = useState("");
	const [skNumber, setSkNumber] = useState(data.sk_number);
	const [noTelp, setNoTelp] = useState("");
	const [email, setEmail] = useState(data.email);
	const [bornPlace, setBornPlace] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [mainTasks, setMainTasks] = useState("");
	const [education, setEducation] = useState("");
	const [address, setAddress] = useState("");
	const [role, setRole] = useState("");
	const [username] = useState(uniqid(8, "minimalis-number"));
	const [password] = useState(uniqid(8, "minimalis-number"));

	const getUsers = async (userid) => {
		await axios
			.get("/api/users/get-user-detail?userid=" + userid)
			.then((res) => {
				setData(res.data.data);
				setName(res.data.data.name);
				setSkNumber(res.data.data.sk_number);
				setNoTelp(res.data.data.no_telp);
				setEmail(res.data.data.email);
				setBornPlace(res.data.data.place);
				setDateOfBirth(
					new Date(res.data.data.date_of_birth).toISOString().split("T")[0]
				);
				setMainTasks(res.data.data.main_task);
				setEducation(res.data.data.education);
				setRole(res.data.data.role);
				setAddress(res.data.data.address);
			});
	};

	const getAbsences = async (userid) => {
		await axios
			.get("/api/absence/get-absences-by-userid?userid=" + userid)
			.then((res) => {
				setDataAbsences(res.data.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const getDailyReport = async (userid) => {
		await axios
			.get("/api/daily-report/get-report-by-userid?userid=" + userid)
			.then((res) => {
				setDataDailyReport(res.data.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		getUsers(params.userid);
		getAbsences(params.userid);
		getDailyReport(params.userid);
	}, []);

	const onHandleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (
			name === "" ||
			email === "" ||
			skNumber === "" ||
			noTelp === "" ||
			bornPlace === "" ||
			dateOfBirth === "" ||
			mainTasks === "" ||
			education === "" ||
			address === "" ||
			role === ""
		) {
			handleAlert(
				"warning",
				"Form Kosong!",
				"Anda masih memiliki form yang kosong, silahkan periksa kembali!",
				false
			);
			setIsLoading(false);
		} else {
			await axios
				.put("/api/users/update-user", {
					userid,
					name,
					email,
					skNumber,
					noTelp,
					bornPlace,
					dateOfBirth,
					mainTasks,
					education,
					address,
					role,
					username,
					password,
				})
				.then((res) => {
					console.log(res.data);
					if (res.data.status === 200) {
						emailjs
							.sendForm(
								"service_eb05ud9",
								"template_quvavj6",
								"#myForm",
								"HahQxeSBq9hkgMF4z"
							)
							.then(
								(response) => {
									Swal.fire({
										icon: "success",
										title: "Success!",
										text: res.data.message,
										allowOutsideClick: false,
									}).then((okay) => {
										if (okay) {
											window.location.reload();
										}
									});
								},
								(error) => {
									Swal.fire({
										icon: "error",
										title: "Error!",
										text: error,
										allowOutsideClick: false,
									}).then((okay) => {
										if (okay) {
											window.location.reload();
										}
									});
								}
							);
					} else {
						handleAlert("error", "Error!", res.data.message, false);
					}
					setIsLoading(false);
				})
				.catch((err) => {
					console.log(err.message);
					setIsLoading(false);
				});
		}
	};

	const InfoUser = () => {
		return (
			<Card>
				<div className="flex flex-col sm:flex-row gap-5">
					<div className="w-100 sm:w-[200px] text-center justify-center items-center">
						<Image
							src={UserImage}
							alt="User Image"
							width={300}
							height={300}
							className="mx-auto"
						/>
						<p>{data.name}</p>
						<small className="italic text-slate-500">{data.sk_number}</small>
						<br />
						<small className="italic text-slate-500">{data.role}</small>
					</div>
					<div className="grow">
						<form
							onSubmit={onHandleSubmit}
							className="mt-3 flex flex-col gap-3"
							id="myForm"
						>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex flex-col basis-1/2">
									<label className="text-slate-500 italic">Nama Lengkap</label>
									<input
										type="text"
										name="nameTo"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Nama Lengkap"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="flex flex-col basis-1/2">
									<label className="text-slate-500 italic">Nomor SK</label>
									<input
										type="text"
										name="skNumber"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Nomor SK"
										value={skNumber}
										onChange={(e) => setSkNumber(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex flex-col basis-1/2">
									<label className="text-slate-500 italic">Nomor Telp</label>
									<input
										type="number"
										name="noTelp"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Nomor Telp"
										value={noTelp}
										onChange={(e) => setNoTelp(e.target.value)}
									/>
								</div>
								<div className="flex flex-col basis-1/2">
									<label className="text-slate-500 italic">Email Aktif</label>
									<input
										type="text"
										name="mailTo"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Email Aktif"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex flex-col basis-1/2">
									<label className="text-slate-500 italic">Tempat Lahir</label>
									<input
										type="text"
										name="bornPlace"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Tempat Lahir"
										value={bornPlace}
										onChange={(e) => setBornPlace(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-3 basis-1/2">
									<label className="text-slate-500 italic">Tanggal Lahir</label>
									<input
										type="date"
										name="dateOfBirth"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Tahun Lahir"
										value={dateOfBirth}
										onChange={(e) => setDateOfBirth(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label className="text-slate-500 italic">Tugas Pokok</label>
								<select
									name="mainTasks"
									className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									value={mainTasks}
									onChange={(e) => setMainTasks(e.target.value)}
								>
									<option value={""}>- Pilih Tugas Pokok -</option>
									<option
										value={
											"Petugas Kebersihan dan Persampahan (Petugas Penyapu Jalan)"
										}
									>
										Petugas Kebersihan dan Persampahan (Petugas Penyapu Jalan)
									</option>
									<option
										value={
											"Petugas Kebersihan dan Persampahan (Pengangkut Sampah)"
										}
									>
										Petugas Kebersihan dan Persampahan (Pengangkut Sampah)
									</option>
									<option
										value={"Petugas Kebersihan dan Persampahan (Pengelola TPA)"}
									>
										Petugas Kebersihan dan Persampahan (Pengelola TPA)
									</option>
									<option
										value={
											"Petugas Kebersihan dan Persampahan (Petugas Retribusi Sampah)"
										}
									>
										Petugas Kebersihan dan Persampahan (Petugas Retribusi
										Sampah)
									</option>
									<option
										value={
											"Petugas Kebersihan dan Persampahan (Petugas Angkutan Sampah)"
										}
									>
										Petugas Kebersihan dan Persampahan (Petugas Angkutan Sampah)
									</option>
									<option
										value={
											"Petugas Kebersihan dan Persampahan (Pengadministrasian Kebersihan)"
										}
									>
										Petugas Kebersihan dan Persampahan (Pengadministrasian
										Kebersihan)
									</option>
									<option value={"Petugas Pertamanan"}>
										Petugas Pertamanan
									</option>
									<option value={"Cleaning Service"}>Cleaning Service</option>
									<option value={"Penjaga Kantor"}>Penjaga Kantor</option>
								</select>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex flex-col gap-3 basis-1/2">
									<label className="text-slate-500 italic">Pendidikan</label>
									<input
										type="text"
										name="education"
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										placeholder="Pendidikan"
										value={education}
										onChange={(e) => setEducation(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-3 basis-1/2">
									<label className="text-slate-500 italic">Role Pengguna</label>
									<select
										className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
										value={role}
										onChange={(e) => setRole(e.target.value)}
									>
										<option value={""}>- Pilih Role Pengguna -</option>
										<option value={"ADMIN"}>ADMIN</option>
										<option value={"EMPLOYEE"}>PEGAWAI</option>
									</select>
								</div>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label className="text-slate-500 italic">Alamat</label>
								<textarea
									name="address"
									className="p-2 ps-0 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset mb-3"
									placeholder="Tulis Alamat Lengkap dari mulai jalan, rt/rw, kelurahan / desa, kecamatan, kabupaten"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								></textarea>
							</div>
							<input
								type="text"
								name="username"
								value={username}
								hidden
								readOnly
							/>
							<input
								type="text"
								name="password"
								value={password}
								hidden
								readOnly
							/>
							<button
								type="submit"
								className="bg-indigo-500 p-3 text-white ms-auto rounded-lg hover:bg-indigo-400 duration-500 ease-in-out"
								disabled={isLoading}
							>
								{isLoading ? "Loading..." : "Perbarui"}
							</button>
						</form>
					</div>
				</div>
			</Card>
		);
	};

	const [modal, setModal] = useState(false);
	const Absences = () => {
		const date = new Date();
		const month = date.getMonth(); // Mendapatkan bulan (0-11)
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const year = date.getFullYear();

		// Option For Absences Data
		// Conditional data Absences
		const rowAbsences = (dataAbsences) => {
			return {
				"bg-red-500 text-black": dataAbsences.status === "TIDAK HADIR",
				"bg-green-500 text-black": dataAbsences.status === "HADIR",
				"bg-orange-500 text-black": dataAbsences.status === "IZIN",
			};
		};

		const formatDate = (dataAbsences) => {
			// Convert the date field to ISO string
			const parsing = new Date(dataAbsences.datemorning);

			const year = parsing.getFullYear();
			const month = String(parsing.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(parsing.getDate()).padStart(2, "0");

			const formattedDateDDMMYYYY = `${day}/${month}/${year}`;
			return formattedDateDDMMYYYY;
		};

		const formatTimeMorning = (dataAbsences) => {
			// Convert the date field to ISO string
			const parsing = new Date(dataAbsences.datemorning);

			const hours = String(parsing.getHours()).padStart(2, "0");
			const minutes = String(parsing.getMinutes()).padStart(2, "0");
			const seconds = String(parsing.getSeconds()).padStart(2, "0");

			let formatedTime = "";

			if (hours == "00") {
				formatedTime = "-";
			} else formatedTime = `${hours}:${minutes}:${seconds}`;

			return formatedTime;
		};

		const formatTimeAfternoon = (dataAbsences) => {
			// Convert the date field to ISO string
			const parsing = new Date(dataAbsences.dateafternoon);

			const hours = String(parsing.getHours()).padStart(2, "0");
			const minutes = String(parsing.getMinutes()).padStart(2, "0");
			const seconds = String(parsing.getSeconds()).padStart(2, "0");

			let formatedTime = "";

			if (hours == "00") {
				formatedTime = "-";
			} else formatedTime = `${hours}:${minutes}:${seconds}`;

			return formatedTime;
		};

		// Misalnya, dataAbsences adalah array dari objek-objek absensi
		const sortedData = dataAbsences
			.slice() // Membuat salinan array agar data asli tidak diubah
			.sort((a, b) => new Date(b.lastdate) - new Date(a.lastdate)); // Urutkan dari terbaru

		// Jika Anda hanya ingin menampilkan 5 data terbaru
		const latestData = sortedData.slice(0, 5);
		const ButtonAction = (data) => {
			if (data.status === "IZIN") {
				return (
					<>
						<button
							type="button"
							onClick={() => setModal(true)}
							className="bg-sky-500 rounded-lg p-2 text-white w-full hover:bg-sky-400"
						>
							Lihat Bukti
						</button>
						<Modal
							title={"Bukti Izin Kehadiran"}
							modal={modal}
							onClose={() => setModal(false)}
						>
							<Image
								src={"/poa/" + data.file}
								alt={data.description}
								width={1000}
								height={1000}
								className="w-auto h-[200px] mb-5 mx-auto"
							/>
							Keterangan :
							<br />
							{data.description}
						</Modal>
					</>
				);
			} else {
				return "-";
			}
		};

		return (
			<>
				<Card className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-5">
					<ChartAbsences
						chartType={"bar"}
						dataType="month"
						dataAbsences={dataAbsences}
						className="grow"
						headerText={
							"Akumulasi Data Kehadiran Per Bulan - " +
							monthNames[month] +
							" " +
							new Date().getFullYear()
						}
					/>
					<ChartAbsences
						chartType={"pie"}
						dataType="year"
						dataAbsences={dataAbsences}
						className="grow h-[340px]"
						headerText={
							"Akumulasi Data Kehadiran Per Tahun - " + new Date().getFullYear()
						}
					/>
				</Card>
				<Card className="mt-5">
					<div className="text-2xl font-bold mb-3">Data Kehadiran</div>
					<DataTable
						value={latestData}
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 25, 50]}
						showGridlines
						tableStyle={{
							minWidth: "50rem",
							fontSize: "9pt",
						}}
						className="custom-table"
						rowClassName={rowAbsences}
					>
						<Column
							body={(_, { rowIndex }) => rowIndex + 1}
							header="No."
						></Column>
						<Column body={formatDate} header="Tanggal (dd/mm/yyyy)"></Column>
						<Column body={formatTimeMorning} header="Jam Absen Pagi"></Column>
						<Column body={formatTimeAfternoon} header="Jam Absen Sore"></Column>
						<Column field="status" header="Status Kehadiran"></Column>
						<Column field="description" header="Keterangan"></Column>
						<Column body={ButtonAction} header="Aksi"></Column>
					</DataTable>
				</Card>
			</>
		);
	};

	const DailyReport = () => {
		const formatDate = (dataDailyReport) => {
			// Convert the date field to ISO string
			const parsing = new Date(dataDailyReport.date);

			const year = parsing.getFullYear();
			const month = String(parsing.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(parsing.getDate()).padStart(2, "0");

			const formattedDateDDMMYYYY = `${day}/${month}/${year}`;
			return formattedDateDDMMYYYY;
		};

		const formatTime = (dataDailyReport) => {
			// Convert the date field to ISO string
			const parsing = new Date(dataDailyReport.date);

			const hours = String(parsing.getHours()).padStart(2, "0");
			const minutes = String(parsing.getMinutes()).padStart(2, "0");
			const seconds = String(parsing.getSeconds()).padStart(2, "0");

			let formatedTime = "";

			if (hours == "00") {
				formatedTime = "-";
			} else formatedTime = `${hours}:${minutes}:${seconds}`;

			return formatedTime;
		};

		// Misalnya, dataAbsences adalah array dari objek-objek absensi
		const latestData = dataDailyReport
			.slice() // Membuat salinan array agar data asli tidak diubah
			.sort((a, b) => new Date(b.date) - new Date(a.date)); // Urutkan dari terbaru

		return (
			<>
				<Card>
					{!dataDailyReport ? (
						dataDailyReport.map((data, key) => {
							if (
								new Date(data.date).toDateString() === new Date().toDateString()
							) {
								return (
									<>
										Waktu Penginputan : {new Date(data.date).toDateString()}
										<br />
										Laporan Hari Ini :
										<br />
										{data.description}
									</>
								);
							} else {
								return (
									<div
										className="p-5 rounded-lg border border-red-500 bg-red-200 text-red-700 text-sm"
										key={key}
									>
										<b>ALERT!</b> Pegawai ini belum mengirimkan laporan harian!
									</div>
								);
							}
						})
					) : (
						<div className="p-5 rounded-lg border border-red-500 bg-red-200 text-red-700 text-sm">
							<b>ALERT!</b> Pegawai ini belum pernah mengirimkan laporan harian!
						</div>
					)}
				</Card>
				<Card className="mt-5">
					<div className="text-2xl font-bold mb-3">Data Laporan Harian</div>
					<DataTable
						value={latestData}
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 25, 50]}
						showGridlines
						tableStyle={{
							minWidth: "50rem",
							fontSize: "9pt",
						}}
						className="custom-table"
						rowClassName={false}
					>
						<Column
							body={(_, { rowIndex }) => rowIndex + 1}
							header="No."
						></Column>
						<Column body={formatDate} header="Tanggal (dd/mm/yyyy)"></Column>
						<Column
							body={formatTime}
							header="Waktu Pengiriman Laporan"
						></Column>
						<Column
							field="description"
							header="Keterangan"
							className="w-[800px]"
						></Column>
					</DataTable>
				</Card>
			</>
		);
	};

	return (
		<>
			{dataAbsences ? (
				dataAbsences.map((data, key) => {
					if (
						new Date(data.lastdate).toDateString() ===
							new Date().toDateString() &&
						data.status === "TIDAK HADIR"
					) {
						return (
							<div
								className="mb-5 p-5 rounded-lg border border-red-500 bg-red-200 text-red-700 text-sm"
								key={key}
							>
								<b>ALERT!</b> Pegawai Ini Belum Absen Hari Ini!
								<br />
								Tanpa Keterangan!
							</div>
						);
					} else if (
						new Date(data.lastdate).toDateString() ===
							new Date().toDateString() &&
						data.status === "HADIR"
					) {
						return (
							<div
								className="mb-5 p-5 rounded-lg border border-green-500 bg-green-200 text-green-700 text-sm"
								key={key}
							>
								<b>ALERT!</b> Pegawai Ini Sudah Absen Hari Ini!
								<br />
								{data.description === "Kehadiran Pagi" ? (
									<span>
										<i className="fa-solid fa-check me-3"></i>
										Pagi
										<br />
										<i className="fa-solid fa-times me-3"></i>
										Sore
									</span>
								) : data.description === "Kehadiran Pagi dan Sore" ? (
									<span>
										<i className="fa-solid fa-check me-3"></i>
										Pagi
										<br />
										<i className="fa-solid fa-check me-3"></i>
										Sore
									</span>
								) : (
									""
								)}
							</div>
						);
					} else if (
						new Date(data.lastdate).toDateString() ===
							new Date().toDateString() &&
						data.status === "IZIN"
					) {
						return (
							<div
								className="mb-5 p-5 rounded-lg border border-orange-500 bg-orange-200 text-orange-700 text-sm"
								key={key}
							>
								<b>ALERT!</b> Pegawai Ini Izin Absen Hari Ini!
								<br />
								{data.description}
							</div>
						);
					}
				})
			) : (
				<div className="mb-5 p-5 rounded-lg border border-slate-500 bg-slate-200 text-slate-700 text-sm">
					<b>ALERT!</b> Pegawai data baru, belum memiliki data absensi, data
					otomatis diperbarui pada jam 00:00 WIB setelah data pegawai
					diinputkan!
				</div>
			)}

			<div className="flex gap-3 w-full mb-5">
				<button
					type="button"
					onClick={() => setMenuData("pegawai")}
					className={
						menuData === "pegawai"
							? "bg-indigo-500 rounded-lg border border-indigo-500 p-2 text-white basis-1/2"
							: "bg-white rounded-lg border border-indigo-500 p-2 text-indigo-500 basis-1/2"
					}
				>
					Info Pegawai
				</button>
				<button
					type="button"
					onClick={() => setMenuData("absen")}
					className={
						menuData === "absen"
							? "bg-indigo-500 rounded-lg border border-indigo-500 p-2 text-white basis-1/2"
							: "bg-white rounded-lg border border-indigo-500 p-2 text-indigo-500 basis-1/2"
					}
				>
					Data Kehadiran
				</button>
				<button
					type="button"
					onClick={() => setMenuData("laporan")}
					className={
						menuData === "laporan"
							? "bg-indigo-500 rounded-lg border border-indigo-500 p-2 text-white basis-1/2"
							: "bg-white rounded-lg border border-indigo-500 p-2 text-indigo-500 basis-1/2"
					}
				>
					Data Laporan Harian
				</button>
			</div>

			{menuData === "pegawai"
				? InfoUser()
				: menuData === "absen"
				? Absences()
				: menuData === "laporan"
				? DailyReport()
				: ""}
		</>
	);
};

export default ViewUser;
