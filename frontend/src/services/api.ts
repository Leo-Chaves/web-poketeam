import axios from "axios";
import { getStoredToken } from "@/lib/auth-storage";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

backendApi.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const pokeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_POKEAPI_URL ?? "https://pokeapi.co/api/v2",
});

export const adviceApi = axios.create({
  baseURL: "https://api.adviceslip.com",
});

export { backendApi };
