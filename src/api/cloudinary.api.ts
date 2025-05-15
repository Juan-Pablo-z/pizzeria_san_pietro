import axios from 'axios';

export const CloudinaryApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL,
  headers: {
    Authorization: "Basic Y3JpczpwYXNzd29yZA==",
    Accept: "application/json",
  },
});
