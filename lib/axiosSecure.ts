import axios from "axios";
import { API_BASE } from "./api";

export const API_BASE_URL = API_BASE;

export const AxiosSecure = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

