import useSWR from "swr";
const { default: axios } = require("axios");

const fetcher = async (url) => await axios.get(url).then((res) => res.data);

// Users
export const getUsers = () => {
	const { data, error, isLoading } = useSWR("/api/users/get/all", fetcher);

	return {
		dataUsers: data?.data,
		errorUsers: error,
		loadingUsers: isLoading,
	};
};

export const getUserDetail = (identifier) => {
	const { data, error, isLoading } = useSWR(
		"/api/users/get/user-detail?identifier=" + identifier,
		fetcher
	);

	return {
		dataUserDetail: data?.data,
		errorUserDetail: error,
		loadingUserDetail: isLoading,
	};
};

// Absences
export const getAbsences = () => {
	const { data, error, isLoading } = useSWR("/api/absence/get/all", fetcher);

	let noAbsenceCount = 0;
	let permissionAbsenceCount = 0;

	if (Array.isArray(data?.data)) {
		data?.data.forEach((item) => {
			const itemDate = new Date(item.lastdate).toDateString();
			const today = new Date().toDateString();

			if (itemDate === today) {
				if (item.status === "TIDAK HADIR") {
					noAbsenceCount++;
				}

				if (item.status === "IZIN") {
					permissionAbsenceCount++;
				}
			}
		});
	}

	return {
		dataAbsences: data?.data,
		dataNoAbsence: noAbsenceCount,
		dataPermissionAbsence: permissionAbsenceCount,
		errorAbsences: error,
		loadingAbsences: isLoading,
	};
};

export const getAbsenceByUser = (userid) => {
	const { data, error, isLoading } = useSWR(
		"/api/absence/get/by-user?userid=" + userid,
		fetcher
	);

	let absenceStatus;

	if (Array.isArray(data?.data)) {
		data?.data.forEach((item) => {
			const itemDate = new Date(item.lastdate).toDateString();
			const today = new Date().toDateString();

			if (itemDate === today) {
				if (item.status === "HADIR" && item.description === "Kehadiran Pagi") {
					absenceStatus = "pagi";
				}

				if (
					item.status === "HADIR" &&
					item.description === "Kehadiran Pagi dan Sore"
				) {
					absenceStatus = "pagidansore";
				}

				if (item.status === "IZIN") {
					absenceStatus = "izin";
				}

				if (item.status === "TIDAK HADIR") {
					absenceStatus = "tidakhadir";
				}
			}
		});
	}

	return {
		dataAbsenceByUser: data?.data,
		dataStatusAbsence: absenceStatus,
		errorAbsenceByUser: error,
		loadingAbsenceByUser: isLoading,
	};
};

// Daily Report
export const getDailyReport = (userid) => {
	const { data, error, isLoading } = useSWR(
		"/api/dailyreport/get/by-user?userid=" + userid,
		fetcher
	);

	let reportStatus = "tidakada";

	if (Array.isArray(data?.data)) {
		data?.data.forEach((item) => {
			const itemDate = new Date(item.date).toDateString();
			const today = new Date().toDateString();

			if (itemDate === today) {
				reportStatus = "sudahmengirim";
			}
		});
	}

	return {
		dataDailyReport: data?.data,
		dataReportStatus: reportStatus,
		dataReportToday: data?.reportToday,
		errorDailyReport: error,
		loadingDailyReport: isLoading,
	};
};
