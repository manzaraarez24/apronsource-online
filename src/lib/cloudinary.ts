const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "souolsm4";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "products";

const MAX_BYTES = 10 * 1024 * 1024;

export class UploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UploadError";
    }
}

/** Uploads an image to Cloudinary (unsigned preset) and returns its https URL. */
export const uploadImage = async (file: File, timeoutMs = 60000): Promise<string> => {
    if (!file.type.startsWith("image/")) {
        throw new UploadError(`"${file.name}" is not an image file.`);
    }
    if (file.size > MAX_BYTES) {
        throw new UploadError(`"${file.name}" is larger than 10 MB. Please use a smaller image.`);
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", UPLOAD_PRESET);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body,
            signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.secure_url) {
            throw new UploadError(data?.error?.message || `Image upload failed (HTTP ${res.status}).`);
        }
        return data.secure_url as string;
    } catch (err: any) {
        if (err.name === "AbortError") {
            throw new UploadError("Image upload timed out. Check your internet connection and try again.");
        }
        if (err instanceof UploadError) throw err;
        throw new UploadError(`Image upload failed: ${err.message || "network error"}`);
    } finally {
        clearTimeout(timer);
    }
};
