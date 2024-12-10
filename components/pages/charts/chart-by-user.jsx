"use client";
import { Chart } from "primereact/chart";

export default function ChartAbsencesByUser({
	headerText,
	className = "",
	chartType,
	dataType = "month",
	dataAbsences,
}) {
	const groupedData = dataAbsences.reduce((result, item) => {
		const date = new Date(item.lastdate);
		const month = date.getMonth(); // Mendapatkan bulan (0-11)
		const year = date.getFullYear();
		const keyPerMonth = `${year}-${month + 1}`; // Membuat key format "2024-11"
		const keyPerYear = `${year}`; // Membuat key format "2024"

		// Inisialisasi objek jika belum ada
		if (dataType === "month") {
			if (!result[keyPerMonth])
				result[keyPerMonth] = { HADIR: 0, "TIDAK HADIR": 0, IZIN: 0 };
			result[keyPerMonth][item.status]++;
		} else {
			if (!result[keyPerYear])
				result[keyPerYear] = { HADIR: 0, "TIDAK HADIR": 0, IZIN: 0 };
			result[keyPerYear][item.status]++;
		}

		return result;
	}, {});

	const generateChartData = (groupedData) => {
		const labels = Object.keys(groupedData); // Bulan (misalnya, "2024-11", "2024-12")
		const hadirData = labels.map((label) => groupedData[label]["HADIR"]);
		const tidakHadirData = labels.map(
			(label) => groupedData[label]["TIDAK HADIR"]
		);
		const izinData = labels.map((label) => groupedData[label]["IZIN"]);

		return {
			labels,
			datasets: [
				{
					label: "Hadir",
					backgroundColor: "#42A5F5",
					data: hadirData,
				},
				{
					label: "Tidak Hadir",
					backgroundColor: "#FF6384",
					data: tidakHadirData,
				},
				{
					label: "Izin",
					backgroundColor: "#FFCE56",
					data: izinData,
				},
			],
		};
	};

	const chartData = generateChartData(groupedData);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: headerText,
			},
		},
	};

	return (
		<Chart
			type={chartType}
			data={chartData}
			options={options}
			className={className}
		/>
	);
}
