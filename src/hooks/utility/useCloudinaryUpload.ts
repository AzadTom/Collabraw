import { useState } from "react";
import { URL } from "@/utils/constant";

/**
 * Custom hook to handle uploading local image files to Cloudinary
 * via our backend's multi-upload API endpoint.
 */
export const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads an array of Files to Cloudinary via the backend upload endpoint.
   * Returns an array of secure URLs from Cloudinary.
   */
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(`${URL}api/v1/upload/multiple`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      // Normalize different possible formats of the response:
      let imageUrls: string[] = [];
      if (Array.isArray(data)) {
        imageUrls = data.map((item: any) => typeof item === "string" ? item : item.url || item.secure_url || item.path);
      } else if (data.imageUrls && Array.isArray(data.imageUrls)) {
        imageUrls = data.imageUrls;
      } else if (data.urls && Array.isArray(data.urls)) {
        imageUrls = data.urls;
      } else if (data.images && Array.isArray(data.images)) {
        imageUrls = data.images.map((item: any) => typeof item === "string" ? item : item.url || item.secure_url || item.path);
      } else if (data.data && Array.isArray(data.data)) {
        imageUrls = data.data.map((item: any) => typeof item === "string" ? item : item.url || item.secure_url || item.path);
      } else {
        throw new Error("Could not find image URLs in API response");
      }

      return imageUrls;
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred during upload.";
      setError(msg);
      console.error("Cloudinary upload hook error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { uploadImages, loading, error };
};
