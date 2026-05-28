import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.config.js";
import env from "../config/env.js";

// Streams an in-memory file buffer to Cloudinary with a deterministic public_id
// (so re-uploads overwrite cleanly and deletes are predictable).
export function uploadBuffer(buffer, { publicId }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Removes every asset stored under a product's folder prefix.
export async function deleteByPrefix(prefix) {
  if (!isCloudinaryConfigured) return;
  try {
    await cloudinary.api.delete_resources_by_prefix(prefix);
    await cloudinary.api.delete_folder(prefix).catch(() => {});
  } catch (error) {
    console.error("Cloudinary cleanup failed for", prefix, error.message);
  }
}

export function productFolder(slug) {
  return `${env.cloudinary.folder}/${slug}`;
}

export { isCloudinaryConfigured };
