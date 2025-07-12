import apiClient from "@/services/apiClient";
import type { Dog } from "./searchTypes";

export const fetchBreeds = async (): Promise<string[]> => {
  const response = await apiClient.get("/dogs/breeds");
  return response.data;
};

export const searchDogs = async (params: URLSearchParams) => {
  const response = await apiClient.get("/dogs/search", { params });
  return response.data;
};

export const fetchDogDetails = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await apiClient.post("/dogs", dogIds);
  return response.data;
};

export const fetchMatch = async (
  dogIds: string[]
): Promise<{ match: string }> => {
  const response = await apiClient.post("/dogs/match", dogIds);
  return response.data;
};
