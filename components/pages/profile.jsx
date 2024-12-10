"use client";
import Scripts from "@/libs/scripts";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { getUserDetail } from "@/libs/custom-swr";

export default function Profile() {
	const { data: session } = useSession();
	const { handleConfirmLogoutAlert } = Scripts();
	const { dataUserDetail, loadingUserDetail } = getUserDetail(
		session?.user?.userid
	);

	return (
		<div className="bg-white rounded-lg p-3 w-full sm:w-[500px] mx-auto">
			<div className="flex flex-col sm:flex-row gap-3 items-center">
				<div className="flex flex-col gap-0 p-0 text-center">
					<QRCodeSVG
						id="qrcodeimage"
						value={dataUserDetail?.token}
						size={220}
						level={"H"}
						includeMargin={true}
					/>
					<small className="italic text-slate-500">
						{loadingUserDetail ? "Generating..." : "Ready"}
					</small>
				</div>

				<div className="flex flex-col text-center items-center grow">
					<Image
						src={"/user.png"}
						alt="User Image"
						width={1000}
						height={1000}
						className="w-[100px] rounded-full"
					/>

					<p className="text-center">
						{session?.user?.name}
						<br />
						<i className="text-slate-400">{dataUserDetail?.sk_number}</i>
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
}
