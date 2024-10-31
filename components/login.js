"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoMJLK from "@/assets/images/logo_mjlk.png";
import Scripts from "@/assets/scripts";

const Login = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { toastAlert } = Scripts();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const HandleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		signIn("credentials", { username, password, redirect: false }).then(
			async (res) => {
				if (res.error) {
					toastAlert(
						"error",
						"Could'nt Authorization!",
						"Invalid Username and Password!",
						5000
					);
				} else return router.push("/dashboard");
				setIsLoading(false);
			}
		);
	};

	return (
		<div className="relative w-full h-[100vh]">
			<div className="absolute objext-cover w-[350px] md:w-[400px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border-2 rounded-lg p-5">
				<div className="flex gap-3 justify-center mb-3">
					<Image
						src={LogoMJLK}
						alt="Logo Majalengka"
						width={0}
						height={0}
						style={{ width: "50px", height: "auto", alignSelf: "center" }}
					/>
					<div className="flex flex-col text-center">
						<small>Dinas Lingkungan Hidup Majalengka</small>
						<small>SIMAPENSI</small>
					</div>
				</div>
				<hr />
				<form onSubmit={HandleSubmit} className="flex flex-col gap-3 mt-3">
					<div className="flex flex-col gap-2">
						<label>Username / Email</label>
						<input
							type="text"
							className="p-3 border-2 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
							placeholder="username / example@mail.com"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Password</label>
						<input
							type={showPassword ? "text" : "password"}
							className="p-3 border-2 rounded-lg outline-0 focus:ring-2 focus:ring-indigo-200 ring-inset"
							placeholder="Your Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="button"
							className="p-1 bg-slate-200 w-[150px] mb-3"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? "Hide Password" : "Show Password"}
						</button>
					</div>
					<hr />
					<button
						type="submit"
						className={
							isLoading
								? "disabled:opacity-75 p-3 bg-indigo-400 text-white duration-500 ease-in-out rounded-lg font-bold mt-3"
								: "p-3 bg-indigo-500 hover:bg-indigo-400 text-white duration-500 ease-in-out rounded-lg font-bold mt-3"
						}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
