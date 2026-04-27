/**
 * Client-side image utilities: resize, format conversion, and anime-style
 * canvas filter for profile picture recreation.
 */

const TARGET_SIZE = 256; // px — square output
const JPEG_QUALITY = 0.88;

/**
 * Read a File and return it as a data URL string.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(/** @type {string} */(reader.result));
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.readAsDataURL(file);
    });
}

/**
 * Load a data URL or object URL into an HTMLImageElement.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not load image."));
        img.src = src;
    });
}

/**
 * Resize any image (via File or data URL) to TARGET_SIZE × TARGET_SIZE,
 * covering and center-cropping the original, and return as a JPEG data URL.
 * @param {string} dataUrl
 * @returns {Promise<string>}
 */
export async function resizeAndCrop(dataUrl) {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;
    const ctx = canvas.getContext("2d");

    // Cover crop: scale so the shorter dimension fills TARGET_SIZE
    const scale = Math.max(TARGET_SIZE / img.naturalWidth, TARGET_SIZE / img.naturalHeight);
    const scaledW = img.naturalWidth * scale;
    const scaledH = img.naturalHeight * scale;
    const offsetX = (TARGET_SIZE - scaledW) / 2;
    const offsetY = (TARGET_SIZE - scaledH) / 2;

    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Apply an anime / cel-shading style filter to a data URL image.
 *
 * Technique:
 *  1. Draw the source image with a vivid-colour CSS filter applied to the
 *     canvas context (saturate + contrast + brightness).
 *  2. Draw the source again using `difference` blend mode at low opacity to
 *     produce edge enhancement (dark outlines around high-contrast areas).
 *  3. Use `multiply` blend mode to overlay a slight cool tint for the
 *     characteristic anime blue-shadow look.
 *
 * All operations are client-side Canvas 2D; no external API required.
 *
 * @param {string} dataUrl — source image data URL
 * @returns {Promise<string>} — processed image as JPEG data URL
 */
export async function applyAnimeFilter(dataUrl) {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;
    const ctx = canvas.getContext("2d");

    // ── Pass 1: vivid flat-colour base (anime-style palette) ─────────────────
    ctx.filter = "saturate(220%) contrast(140%) brightness(108%) hue-rotate(5deg)";
    ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);
    ctx.filter = "none";

    // ── Pass 2: posterise — quantise pixel values to create cel-shading bands ─
    const imageData = ctx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE);
    const data = imageData.data;
    const levels = 6; // number of discrete colour levels
    const factor = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(Math.round(data[i] / factor) * factor); // R
        data[i + 1] = Math.round(Math.round(data[i + 1] / factor) * factor); // G
        data[i + 2] = Math.round(Math.round(data[i + 2] / factor) * factor); // B
    }
    ctx.putImageData(imageData, 0, 0);

    // ── Pass 3: edge outlines via a second image drawn in difference blend ────
    ctx.globalCompositeOperation = "difference";
    ctx.filter = "blur(1px) contrast(300%) brightness(30%)";
    ctx.globalAlpha = 0.18;
    ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // ── Pass 4: cool blue-tint overlay (anime shadow tone) ────────────────────
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#a8c8f8";
    ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
