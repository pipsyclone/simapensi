"use client";
import { useEffect } from "react";

const Modal = ({ modal, onClose, title = "Title Here", children }) => {
	useEffect(() => {
		if (modal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		// Mengembalikan overflow menjadi 'auto' ketika komponen di-unmount
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [modal]);

	return (
		<div
			id="modal"
			className={
				"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden " +
				(modal ? "" : "hidden")
			}
		>
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
				<div className="relative flex justify-between items-center">
					<h2 className="text-2xl font-bold mb-4">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="absolute top-0 right-0 text-xl"
					>
						<i className="fa-solid fa-times"></i>
					</button>
				</div>
				<div className="text-black">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
