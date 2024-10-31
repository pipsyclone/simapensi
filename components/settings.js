"use client";
import Scripts from "@/assets/scripts";
import Image from "next/image";
import UserImage from "@/assets/images/user.png";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const Settings = () => {
	const { data: session } = useSession();
	const { handleConfirmLogoutAlert } = Scripts();

	const [data, setData] = useState(null);
	const getUserSessionDetail = async (userid) => {
		await axios
			.get("/api/users/get-user-session-detail?userid=" + userid)
			.then((res) => {
				setData(res.data.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		getUserSessionDetail(session?.user?.userid);
	}, [session]);
	return (
		<div className="bg-white rounded-lg p-3 w-full sm:w-[500px] mx-auto">
			<div className="flex flex-col sm:flex-row gap-3 items-center">
				<div className="flex flex-col gap-0 p-0 text-center">
					<QRCodeSVG
						id="qrcodeimage"
						value={data?.token}
						size={220}
						level={"H"}
						includeMargin={true}
					/>
					<small className="italic text-slate-500">
						{data !== null ? "Ready" : "Generating..."}
					</small>
				</div>

				<div className="flex flex-col text-center items-center grow">
					<Image
						src={UserImage}
						alt="User Image"
						width={100}
						height={100}
						className="rounded-full"
					/>

					<p className="text-center">
						{session?.user?.name}
						<br />
						<i className="text-slate-400">{data?.sk_number}</i>
					</p>
					<small>{session?.user?.role}</small>
					<button
						className="bg-red-500 p-2 text-white rounded-lg w-fit mt-3"
						onClick={() => handleConfirmLogoutAlert()}
					>
						Keluar
					</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
