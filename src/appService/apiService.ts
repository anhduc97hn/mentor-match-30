import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "./config";

const apiService: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

apiService.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // console.log("Start Request", request);
    return request;
  },
  function (error: AxiosError) {
    // console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("Response", response);
    return response.data;
  },
  function (error: AxiosError) {
    // console.log("RESPONSE ERROR", error.response);
    return Promise.reject(error.response?.data);
  }
);

export default apiService;