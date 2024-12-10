"use client";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import Card from "@/components/ui/card";
import Scripts from "@/libs/scripts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function Register() {
	const { handleAlert, uniqid } = Scripts();
	const [isLoading, setIsLoading] = useState(false);
	const [menu, setMenu] = useState("default");

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [skNumber, setSkNumber] = useState("");
	const [noTelp, setNoTelp] = useState("");
	const [bornPlace, setBornPlace] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [mainTasks, setMainTasks] = useState("");
	const [education, setEducation] = useState("");
	const [address, setAddress] = useState("");
	const [role, setRole] = useState("");
	const [username] = useState(uniqid(8, "minimalis-number"));
	const [password] = useState(uniqid(8, "minimalis-number"));

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
				.post("/api/users/post/register", {
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

	const [dataExcel, setDataExcel] = useState([]);
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return; // Periksa apakah file ada

		const reader = new FileReader();

		reader.onload = (e) => {
			const binaryStr = e.target.result;
			const workbook = XLSX.read(binaryStr, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet);
			setDataExcel(jsonData);
		};

		reader.readAsBinaryString(file);
	};

	const handleSubmitWithFile = async (e) => {
		e.preventDefault();
		await axios
			.post("/api/users/register-with-file", {
				data: dataExcel,
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		console.log(dataExcel);
	}, [dataExcel]);

	return (
		<div className="mx-auto">
			<Card>
				<p className="text-4xl bold mb-3">REGISTER</p>
				<hr />
				<div className="flex flex-col sm:flex-row gap-3 mt-3">
					<button
						className="bg-indigo-500 p-2 text-white rounded-lg"
						onClick={() => setMenu("default")}
					>
						Upload Menggunakan Form
					</button>
					{/* <button
						className="bg-indigo-500 p-2 text-white rounded-lg"
						onClick={() => setMenu("file")}
					>
						Upload Menggunakan File Excel (.xlsx)
					</button> */}
				</div>
				{menu === "default" ? (
					<form
						onSubmit={onHandleSubmit}
						className="mt-3 flex flex-col gap-3"
						id="myForm"
					>
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Nama Lengkap</label>
								<input
									type="text"
									name="nameTo"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Nama Lengkap"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Nomor SK</label>
								<input
									type="text"
									name="skNumber"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Nomor SK"
									value={skNumber}
									onChange={(e) => setSkNumber(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Nomor Telp</label>
								<input
									type="number"
									name="noTelp"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Nomor Telp"
									value={noTelp}
									onChange={(e) => setNoTelp(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Email Aktif</label>
								<input
									type="text"
									name="mailTo"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Email Aktif"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Tempat Lahir</label>
								<input
									type="text"
									name="bornPlace"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Tempat Lahir"
									value={bornPlace}
									onChange={(e) => setBornPlace(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Tanggal Lahir</label>
								<input
									type="date"
									name="dateOfBirth"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Tahun Lahir"
									value={dateOfBirth}
									onChange={(e) => setDateOfBirth(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Tugas Pokok</label>
								<select
									name="mainTasks"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
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
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Pendidikan</label>
								<input
									type="text"
									name="education"
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
									placeholder="Pendidikan"
									value={education}
									onChange={(e) => setEducation(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3 basis-1/2">
								<label>Role Pengguna</label>
								<select
									className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
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
							<label>Alamat</label>
							<textarea
								name="address"
								rows={7}
								className="p-2 border rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset mb-3"
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
							{isLoading ? "Loading..." : "Simpan"}
						</button>
					</form>
				) : (
					<form
						onSubmit={handleSubmitWithFile}
						className="flex flex-col gap-3 w-auto mt-5"
					>
						<label>Masukkan file excel : </label>
						<input
							type="file"
							className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ring-inset"
							accept=".xlsx, .xls"
							onChange={handleFileUpload}
						/>

						<button
							type="submit"
							className="bg-indigo-500 p-3 text-white ms-auto rounded-lg hover:bg-indigo-400 duration-500 ease-in-out"
							disabled={isLoading}
						>
							{isLoading ? "Loading..." : "Simpan"}
						</button>
					</form>
				)}
			</Card>
		</div>
	);
}
