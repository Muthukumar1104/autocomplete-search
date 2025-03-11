import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchProducts = async (query, page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?search=${query}&limit=15&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};
