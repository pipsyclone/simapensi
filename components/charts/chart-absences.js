"use client";
import { Chart } from "primereact/chart";

const ChartAbsences = ({ chartType, dataType = "month", dataAbsences }) => {
	const groupedData = dataAbsences.reduce((result, item) => {
		const date = new Date(item.date);
		const month = date.getMonth(); // Mendapatkan bulan (0-11)
		const year = date.getFullYear();
		const keyPerMonth = `${year}-${month + 1}`; // Membuat key format "2024-11"
		const keyPerYear = `${year}`; // Membuat key format "2024"

		// Inisialisasi objek jika belum ada
		if (dataType === "month") {
			result[keyPerMonth] = { HADIR: 0, "TIDAK HADIR": 0, IZIN: 0 };
		} else {
			result[keyPerYear] = { HADIR: 0, "TIDAK HADIR": 0, IZIN: 0 };
		}

		// Increment jumlah status berdasarkan bulan
		if (dataType === "month") result[keyPerMonth][item.status]++;
		else result[keyPerYear][item.status]++;
		return result;
	}, {});

	const generateChartData = (groupedData) => {
		const labels = Object.keys(groupedData); // Bulan (misalnya, "2024-11", "2024-12")
		const hadirData = labels.map((label) => groupedData[label].HADIR);
		const tidakHadirData = labels.map(
			(label) => groupedData[label]["TIDAK HADIR"]
		);
		const izinData = labels.map((label) => groupedData[label].IZIN);

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
				text: "Akumulasi Kehadiran Per Bulan",
			},
		},
	};

	return (
		<Chart
			type={chartType}
			data={chartData}
			options={options}
			className="w-full"
		/>
	);
};

export default ChartAbsences;
