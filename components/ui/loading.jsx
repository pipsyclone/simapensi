export default function Loading() {
	return (
		<div className="relative w-full h-[100vh] bg-indigo-500 duration-500 ease-in-out">
			<div className="absolute w-[200px] md:w-[400px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-center">
				Loading...
			</div>
		</div>
	);
}
