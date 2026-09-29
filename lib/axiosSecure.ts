import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kind-paws.vercel.app";

export const AxiosSecure = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
