"use client";

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "./config";
import Cookies from "js-cookie";

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
    if (error.response && error.response.status === 401) {
      // Prevent infinite loops: Don't redirect if already on login
      if (window.location.pathname.includes("/login")) {
        Cookies.remove("accessToken");
        // window.location.href to force a full refresh and clear React state
        window.location.href = `/login?from=${window.location.pathname}&reason=session_expired`;
      }
    }
    return Promise.reject(error.response?.data);
  }
);

export default apiService;
