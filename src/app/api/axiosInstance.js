import * as axios from "axios";

const baseURLs = ["https://roomac.tatlead.com", "https://it114118-fyp.herokuapp.com"];

const getBaseURL = () => {
	if (localStorage.getItem("baseURL") === baseURLs[0]) {
		return baseURLs[0];
	} else if (localStorage.getItem("baseURL") === baseURLs[1]) {
		return baseURLs[1];
	}

	localStorage.setItem("baseURL", baseURLs[0]);

	return getBaseURL();
}

const setBaseURL = (id) => {
	localStorage.setItem("baseURL", baseURLs[id]); 
	createAxiosInstance();
}

var axiosInstance;

const createAxiosInstance = () => {
	axiosInstance = axios.create({
		baseURL: getBaseURL(),
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
}

createAxiosInstance();

export { axiosInstance, baseURLs, getBaseURL, setBaseURL };
