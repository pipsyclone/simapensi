"use client";
import { useState } from "react";

const Modal = () => {
	const [modal, setModal] = useState(false);
	return (
		<div
			id="modal"
			className={
				"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 " +
				modal
					? "hidden"
					: ""
			}
		>
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
				<div className="relative flex justify-between items-center">
					<h2 className="text-2xl font-bold mb-4">Modal Title</h2>
					<button className="absolute top-0 right-0 text-xl">
						<i className="fa-solid fa-times"></i>
					</button>
				</div>
				<p className="text-gray-700 mb-4">
					This is the content of the modal. Add any information here.
				</p>
			</div>
		</div>
	);
};

export default Modal;
