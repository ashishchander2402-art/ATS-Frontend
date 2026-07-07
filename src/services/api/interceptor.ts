import api from "./axios";

// ======================
// Request Interceptor
// ======================
api.interceptors.request.use(
  (config) => {
    // No authentication/token required for now.

    console.log(
      `[Request] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================
// Response Interceptor
// ======================
api.interceptors.response.use(
  (response) => {
    console.log("[Response]", response);

    return response;
  },
  (error) => {
    console.error("[API Error]", error);

    // Network Error
    if (!error.response) {
      console.error("Network Error");
    }

    switch (error.response?.status) {
      case 400:
        console.error("Bad Request");
        break;

      case 401:
        console.error("Unauthorized");
        break;

      case 403:
        console.error("Forbidden");
        break;

      case 404:
        console.error("API Not Found");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        console.error("Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default api;