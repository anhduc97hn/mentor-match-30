"use client";

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "./config";
import Cookies from "js-cookie";

const apiService: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

apiService.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    return request;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async function (error: AxiosError) {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // Retry logic for network errors, server errors (5xx), and rate limiting (429)
    if (config && (config._retryCount || 0) < MAX_RETRIES) {
      const isNetworkError = !error.response;
      const isServerError = error.response && error.response.status >= 500 && error.response.status < 600;
      const isRateLimit = error.response && error.response.status === 429;

      if (isNetworkError || isServerError || isRateLimit) {
        config._retryCount = (config._retryCount || 0) + 1;
        const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1); // Exponential backoff

        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiService(config);
      }
    }

    if (error.response && error.response.status === 401) {
      // Prevent infinite loops: Don't redirect if already on login
      if (window.location.pathname.includes("/login")) {
        Cookies.remove("accessToken");
        // window.location.href to force a full refresh and clear React state
        window.location.href = `/login?from=${window.location.pathname}&reason=session_expired`;
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiService;
