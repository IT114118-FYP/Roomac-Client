import * as axios from "axios";

const baseURL = "https://it114118-fyp.herokuapp.com";
const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
});

axiosInstance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: "Bearer " + localStorage.getItem("authToken"),
		};
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

export { axiosInstance };
