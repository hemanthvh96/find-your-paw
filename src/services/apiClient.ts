import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired. Logging out");
      localStorage.removeItem("user");
      sessionStorage.clear();

      window.location.assign("/find-your-paw/login");
      return Promise.reject(error);
    }
  }
);

export default apiClient;
