"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";

const Dashboard = (props) => {
	const { data: session, status } = useSession();
	const [sidebar, setSidebar] = useState(false);

	if (status === "loading") return <Loading />;

	return (
		<div className="relative w-full h-screen flex">
			<div
				className={
					sidebar
						? "block sm:hidden fixed bg-slate-700 opacity-25 w-full h-screen z-20"
						: "hidden fixed bg-slate-700 opacity-75 w-full h-screen z-20"
				}
			></div>
			<div
				className={
					sidebar
						? "ms-0 sm:ms-[-300px] fixed bg-white w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
						: "ms-[-300px] sm:ms-0 fixed bg-white w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
				}
			>
				<div className="relative flex gap-3 mb-3">
					<Image
						src={"/favico.png"}
						alt="Logo Majalengka"
						width={1000}
						height={1000}
						style={{ width: "40px", height: "auto", alignSelf: "center" }}
					/>
					<div className="flex flex-col">
						<small>Dinas Lingkungan Hidup</small>
						<small>Majalengka</small>
					</div>
					<button
						type="button"
						className="absolute right-5 text-xl block sm:hidden"
						onClick={() => setSidebar(!sidebar)}
					>
						<i className="fa-solid fa-times"></i>
					</button>
				</div>
				<hr />
				<div className="flex flex-col gap-3 mt-3">
					<a
						href="/dashboard"
						className="flex border-0 bg-indigo-500 text-white rounded-lg p-2 duration-500 ease-in-out"
					>
						<div className="w-12 text-center">
							<i className="fa-solid fa-home"></i>
						</div>
						Beranda
					</a>

					{session?.user?.role === "ADMIN" ? (
						<>
							<a
								href="/dashboard/users"
								className="flex text-indigo-500 border-0  hover:bg-indigo-500 hover:text-white rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-users"></i>
								</div>
								Pengguna
							</a>
							<a
								href="/dashboard/users/register"
								className="flex text-indigo-500 border-0 hover:bg-indigo-500 hover:text-white rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-user-plus"></i>
								</div>
								Register Pengguna
							</a>
						</>
					) : (
						<>
							<a
								href="/dashboard/daily-report"
								className="flex text-indigo-500 border-0 hover:bg-indigo-500 hover:text-white rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-book"></i>
								</div>
								Laporan Harian
							</a>
							<a
								href="/dashboard/poa"
								className="flex text-indigo-500 border-0  hover:bg-indigo-500 hover:text-white rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-briefcase"></i>
								</div>
								Bukti Izin Kehadiran
							</a>
						</>
					)}
				</div>
			</div>
			<div
				className={
					sidebar
						? "flex flex-col w-screen h-screen ms-0 duration-500 ease-in-out"
						: "flex flex-col w-screen h-screen ms-0 sm:ms-[300px] duration-500 ease-in-out"
				}
			>
				<nav className="bg-indigo-500 text-white p-3 ps-5 pe-5 flex justify-between items-center">
					<button
						type="button"
						className="text-2xl"
						onClick={() => setSidebar(!sidebar)}
					>
						{sidebar ? (
							<i className="fa-solid fa-times"></i>
						) : (
							<i className="fa-solid fa-bars"></i>
						)}
					</button>

					<div className="flex gap-8 items-center">
						<a
							href="/dashboard/profile"
							className="flex gap-1 text-sm italic items-center"
						>
							<Image
								src={"/user.png"}
								alt="user"
								width={1000}
								height={1000}
								className="w-[30px] rounded-full"
							/>
							Hi, {session?.user?.name}
						</a>
					</div>
				</nav>

				<div className="p-5">{props.content}</div>
				<div className="bg-white text-slate-400 italic text-sm mt-auto p-5 w-full">
					Dinas Lingkungan Hidup Majalengka
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
