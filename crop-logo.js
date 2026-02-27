import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cropLogo() {
    const logoPath = path.join(__dirname, "src", "assets", "logo.png");
    try {
        const image = await Jimp.read(logoPath);
        // Crop bottom 60px to remove Gemini watermark
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // x, y, width, height
        image.crop({ x: 0, y: 0, w: width, h: height - 60 });

        await image.write(logoPath);
        console.log("Logo cropped successfully!");
    } catch (err) {
        console.error("Error cropping logo:", err);
    }
}

cropLogo();
