export default function CardDetail(props) {
	return (
		<div
			className={
				"grow bg-white border-s-4 " +
				props.borderColor +
				" p-3 rounded-lg duration-500 ease-in-out flex flex-col gap-5 basis-1/2"
			}
		>
			<p className="text-lg bold">{props.title}</p>
			<b>{props.data}</b>
			<small className="italic text-slate-500">{props.footerText}</small>
		</div>
	);
}
