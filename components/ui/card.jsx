export default function Card({ className = "", children }) {
	return (
		<div className={`bg-white border rounded-lg p-3 ${className}`}>
			{children}
		</div>
	);
}
