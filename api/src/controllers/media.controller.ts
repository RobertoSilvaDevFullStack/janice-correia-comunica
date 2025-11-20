// api/src/controllers/media.controller.ts - VERSÃO CORRIGIDA
import { Request, Response } from "express";
import Busboy from "busboy";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/jpg",
  "image/webp",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadImage = (req: Request, res: Response) => {
  try {
    // Verificar se há content-type
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return res
        .status(400)
        .json({ error: "Content-Type deve ser multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });
    let finished = false;
    let fileProcessed = false;

    busboy.on(
      "file",
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        info: { filename: string; encoding: string; mimeType: string }
      ) => {
        console.log(
          `📁 Recebendo arquivo: ${info.filename}, tipo: ${info.mimeType}`
        );

        // Verificar tipo de arquivo
        if (!ALLOWED.has(info.mimeType)) {
          file.resume();
          if (!finished) {
            finished = true;
            return res.status(400).json({
              error: "Formato inválido. Use JPG, PNG, GIF ou WEBP",
              received: info.mimeType,
              allowed: Array.from(ALLOWED),
            });
          }
          return;
        }

        // Gerar nome único
        const ext = info.filename.includes(".")
          ? info.filename.split(".").pop()
          : "png";
        const finalName = `${uuidv4()}.${ext}`;

        // Criar diretório se não existir
        const uploadsDir = path.join(__dirname, "..", "..", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const targetPath = path.join(uploadsDir, finalName);
        const writeStream = fs.createWriteStream(targetPath);

        let size = 0;
        let sizeExceeded = false;

        file.on("data", (data: Buffer) => {
          size += data.length;
          if (size > MAX_SIZE && !sizeExceeded) {
            sizeExceeded = true;
            file.resume();
            writeStream.destroy();

            // Remover arquivo parcial
            try {
              if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
              }
            } catch (e) {
              console.error("Erro ao remover arquivo:", e);
            }

            if (!finished) {
              finished = true;
              return res.status(413).json({
                error: "Arquivo excede 5MB",
                size: Math.round((size / 1024 / 1024) * 100) / 100 + "MB",
                max: "5MB",
              });
            }
          }
        });

        file.pipe(writeStream);

        writeStream.on("finish", () => {
          if (sizeExceeded || finished) return;

          fileProcessed = true;

          // Construir URL pública
          const protocol =
            req.secure || req.headers["x-forwarded-proto"] === "https"
              ? "https"
              : "http";
          const host = req.get("host");
          const baseUrl =
            process.env.PUBLIC_UPLOAD_BASE_URL || `${protocol}://${host}`;
          const url = `${baseUrl}/uploads/${finalName}`;

          console.log(`✅ Upload concluído: ${url}`);

          if (!finished) {
            finished = true;
            return res.status(201).json({
              url,
              filename: finalName,
              size: Math.round((size / 1024) * 100) / 100 + "KB",
              mimeType: info.mimeType,
            });
          }
        });

        writeStream.on("error", (err) => {
          console.error("❌ Erro ao salvar arquivo:", err);

          // Remover arquivo parcial
          try {
            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath);
            }
          } catch (e) {
            console.error("Erro ao remover arquivo:", e);
          }

          if (!finished) {
            finished = true;
            return res.status(500).json({ error: "Falha ao salvar arquivo" });
          }
        });
      }
    );

    busboy.on("error", (err: Error) => {
      console.error("❌ Busboy error:", err);
      if (!finished) {
        finished = true;
        return res
          .status(500)
          .json({ error: "Falha no processamento do upload" });
      }
    });

    busboy.on("finish", () => {
      // Timeout para verificar se o arquivo foi processado
      setTimeout(() => {
        if (!finished && !fileProcessed) {
          finished = true;
          return res
            .status(400)
            .json({ error: "Nenhum arquivo enviado ou arquivo vazio" });
        }
      }, 100);
    });

    req.pipe(busboy);
  } catch (e) {
    console.error("❌ Upload handler error:", e);
    return res.status(500).json({ error: "Erro interno no upload" });
  }
};
