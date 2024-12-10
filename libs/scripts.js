import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
const Scripts = () => {
	// Sweetalert 2
	// Alert
	const handleAlert = (icon, title, message, outsideClick) => {
		Swal.fire({
			title: title,
			text: message,
			icon: icon,
			allowOutsideClick: outsideClick,
		});
	};

	// Toast
	const toastAlert = (icon, title, text, duration) => {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: duration,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: icon,
			title: title,
			text: text,
		});
	};

	// Confirmed Alert
	const handleConfirmLogoutAlert = () => {
		Swal.fire({
			icon: "warning",
			title: "Apakah anda ingin keluar ?",
			showCancelButton: true,
			cancelButtonText: "Tidak",
			confirmButtonText: "Ya",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				signOut({ redirect: false }).then(() => {
					window.location.href = "/auth";
				});
			}
		});
	};

	function uniqid(length, type) {
		if (type == "alphabetic") {
			let result = "";
			let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else if (type == "number") {
			let result = "";
			let characters = "0123456789";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else if (type == "minimalis") {
			let result = "";
			let characters = "abcdefghijklmnopqrstuvwxyz";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else if (type == "alphabetic-number") {
			let result = "";
			let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else if (type == "alphabetic-minimalis") {
			let result = "";
			let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else if (type == "minimalis-number") {
			let result = "";
			let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		} else {
			let result = "";
			let characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}

			return result;
		}
	}

	return {
		handleAlert,
		toastAlert,
		handleConfirmLogoutAlert,
		uniqid,
	};
};

export default Scripts;
