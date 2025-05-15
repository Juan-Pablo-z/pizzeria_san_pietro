import { CloudinaryApi } from "@/api/cloudinary.api";
import { auth } from "@/lib/auth";
import axios from "axios";

type ImageResponse = {
  public_id: string;
  secure_url: string;
};

export const uploadFile = async (
  formData: FormData
): Promise<ImageResponse> => {
  const { data } = await CloudinaryApi.post<ImageResponse>(
    "/image/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return { secure_url: data.secure_url, public_id: data.public_id };
};
