import apiClient from "@/services/apiClient";

export const loginAPI = async (name: string, email: string) => {
  const response = await apiClient.post("/auth/login", { name, email });
  return response.data;
};

export const logoutAPI = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};
