"use client";
import Card from "./card";
import Image from "next/image";
import UserImage from "@/assets/images/user.png";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Scripts from "@/assets/scripts";

const ViewUser = () => {
	const params = useParams();
	const { uniqid } = Scripts();
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState([]);
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

	useEffect(() => {
		getUsers(params.userid);
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
			// await axios
			// 	.post("/api/users/register", {
			// 		name,
			// 		email,
			// 		skNumber,
			// 		noTelp,
			// 		bornPlace,
			// 		dateOfBirth,
			// 		mainTasks,
			// 		education,
			// 		address,
			// 		role,
			// 		username,
			// 		password,
			// 	})
			// 	.then((res) => {
			// 		console.log(res.data);
			// 		if (res.data.status === 200) {
			// 			emailjs
			// 				.sendForm(
			// 					"service_eb05ud9",
			// 					"template_quvavj6",
			// 					"#myForm",
			// 					"HahQxeSBq9hkgMF4z"
			// 				)
			// 				.then(
			// 					(response) => {
			// 						Swal.fire({
			// 							icon: "success",
			// 							title: "Success!",
			// 							text: res.data.message,
			// 							allowOutsideClick: false,
			// 						}).then((okay) => {
			// 							if (okay) {
			// 								window.location.reload();
			// 							}
			// 						});
			// 					},
			// 					(error) => {
			// 						Swal.fire({
			// 							icon: "error",
			// 							title: "Error!",
			// 							text: error,
			// 							allowOutsideClick: false,
			// 						}).then((okay) => {
			// 							if (okay) {
			// 								window.location.reload();
			// 							}
			// 						});
			// 					}
			// 				);
			// 		} else {
			// 			handleAlert("error", "Error!", res.data.message, false);
			// 		}
			// 		setIsLoading(false);
			// 	})
			// 	.catch((err) => {
			// 		console.log(err.message);
			// 		setIsLoading(false);
			// 	});
		}
	};

	return (
		<>
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
								{isLoading ? "Loading..." : "Simpan"}
							</button>
						</form>
					</div>
				</div>
			</Card>
		</>
	);
};

export default ViewUser;
