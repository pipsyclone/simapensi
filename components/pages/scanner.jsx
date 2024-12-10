"use client";
import Scripts from "@/libs/scripts";
import axios from "axios";
import QrScanner from "qr-scanner";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

const QRScanner = () => {
	const scanner = useRef();
	const videoEl = useRef(null);
	const { handleAlert, handleAlertStaticBackdrop, handleDynamicConfirmAlert } =
		Scripts();

	// Result
	const [isLoading, setIsLoading] = useState(false);
	const [cameraStatus, setCameraStatus] = useState("");

	// Konversi waktu absen ke zona waktu WIB (UTC+7)
	const waktuAbsen = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
	);

	// Set batas waktu jam 08.00 WIB pada hari yang sama
	const batasWaktuPagi = new Date(waktuAbsen);
	batasWaktuPagi.setHours(8, 0, 0, 0); // 08:00:00 WIB
	const batasWaktuSore = new Date(waktuAbsen);
	batasWaktuSore.setHours(8, 0, 0, 0); // 08:00:00 WIB

	// Success
	const onScanSuccess = async (result) => {
		setIsLoading(true);
		scanner?.current?.stop();
		await axios
			.get("/api/users/get/user-detail?identifier=" + result?.data)
			.then((res) => {
				setIsLoading(false);
				if (res.data.data === null) {
					Swal.fire({
						icon: "error",
						title: "Expired Token!",
						text: "Token anda sudah kadaluarsa, silahkan refresh halaman profil anda!",
						allowOutsideClick: false,
					}).then((okay) => {
						if (okay) {
							scanner?.current?.start();
						}
					});
				} else {
					// Jika qr code sama pada data user
					Swal.fire({
						icon: "info",
						title: "Konfirmasi Absen!",
						text:
							"Apakah ini benar " +
							res.data.data.name +
							"?, jika bukan silahkan scan ulang!",
						showCancelButton: true,
						cancelButtonText: "Bukan saya!",
						confirmButtonText: "Ya itu saya",
						allowOutsideClick: false,
					})
						.then(async (okay) => {
							/* Read more about isConfirmed, isDenied below */
							if (okay.isConfirmed) {
								scanner?.current?.start();
								await axios
									.post("/api/absence/post/validating-qr-token", {
										userid: res.data.data.userid,
									})
									.then((result) => {
										if (result.data.status === 200) {
											handleAlert(
												"success",
												"Berhasil!",
												"Anda absen pada pukul, " +
													new Date().toLocaleTimeString() +
													"!",
												false
											);
										} else if (result.data.status === 203) {
											handleAlert(
												"warning",
												"Absensi Sudah Dilakukan!",
												result.data.message,
												false
											);
										} else {
											handleAlert(
												"error",
												"Absensi Gagal!",
												result.data.message,
												false
											);
										}
										// console.log(result.data);
									});
							} else {
								scanner?.current?.start();
							}
						})
						.catch((err) => {
							handleAlert("error", "Server Error!", err.message, false);
						});
				}
			});
	};

	// Fail
	const onScanFail = (err) => {
		console.log(err);
		setCameraStatus(err);
	};

	useEffect(() => {
		if (videoEl?.current && !scanner.current) {
			scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
				onDecodeError: onScanFail,
				preferredCamera: "environment",
				highlightScanRegion: true,
				highlightCodeOutline: true,
				overlay: undefined,
				maxScansPerSecond: 1,
			});

			// 🚀 Start QR Scanner
			scanner?.current?.start();
			setCameraStatus("Running!");
		}

		// 🧹 Clean up on unmount.
		// 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
		return () => {
			if (!videoEl?.current) {
				scanner?.current?.stop();
				setCameraStatus("Stopped!");
			}
		};
	}, []);

	return (
		<div className="relative w-full h-[100vh]">
			<div className="absolute w-[500px] h-[500px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
				<video ref={videoEl} className="w-full h-full object-cover"></video>
				<small>
					<i>Status : {cameraStatus}</i>
				</small>
			</div>
		</div>
	);
};

export default QRScanner;
