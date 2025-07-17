import busboy from "busboy";
import { Readable } from "stream";
import { v4 as uuid } from "uuid";
import cloudinary from "./cloudinary";

export const bufferToStream = (buffer: any) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const parseFormData = async (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contentType = req.headers.get("content-type");
      if (!contentType?.startsWith("multipart/form-data")) {
        return reject("Unsupported content type");
      }

      const bb = busboy({
        headers: Object.fromEntries(req.headers.entries()),
      });

      const fields: any = {};
      const files: any = {};

      bb.on("field", (name, val) => {
        fields[name] = val;
      });

      bb.on("file", (name, file, info) => {
        const buffers: any = [];
        file.on("data", (data) => buffers.push(data));
        file.on("end", () => {
          files[name] = {
            buffer: Buffer.concat(buffers),
            originalname: info.filename,
            mimetype: info.mimeType,
          };
        });
      });

      bb.on("error", (err) => {
        reject(err);
      });

      bb.on("finish", () => {
        resolve({ fields, files });
      });

      const reader = req.body.getReader();
      const stream = new Readable({
        read() {},
      });

      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            stream.push(null);
            break;
          }
          stream.push(value);
        }
      };

      await pump();
      stream.pipe(bb);
    } catch (err) {
      reject(err);
    }
  });
};
export const uploadFile = async (file: any) => {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        public_id: uuid(),
        resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    bufferToStream(file.buffer).pipe(stream);
  });
};
