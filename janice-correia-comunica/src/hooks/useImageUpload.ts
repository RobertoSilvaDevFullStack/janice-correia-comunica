// Hook personalizado para upload de imagens
// Salve como: src/hooks/useImageUpload.ts

import { useState } from "react";
import api from "@/lib/api";

interface UploadResponse {
  url: string;
  filename: string;
  size: string;
  mimeType: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Validar arquivo
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Formato não suportado. Use JPG, PNG, GIF ou WEBP");
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("Arquivo muito grande. Máximo: 5MB");
      }

      // Criar FormData
      const formData = new FormData();
      formData.append("image", file);

      console.log("📤 Enviando arquivo:", {
        name: file.name,
        type: file.type,
        size: `${Math.round(file.size / 1024)}KB`,
      });

      // Fazer upload com progress
      const response = await api.post<UploadResponse>(
        "/media/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
              console.log(`📊 Progress: ${percentCompleted}%`);
            }
          },
        }
      );

      console.log("✅ Upload concluído:", response.data);
      setProgress(100);
      return response.data.url;
    } catch (err: unknown) {
      console.error("❌ Erro no upload:", err);

      let errorMessage = "Erro ao fazer upload";

      const e = err as { response?: { data?: { error?: string } }; message?: string };
      if (e.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e.message) {
        errorMessage = e.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadImage,
    uploading,
    progress,
    error,
    reset,
  };
};

// Componente removido deste arquivo para evitar conflitos TS/JSX.
