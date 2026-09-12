import { getSession } from "@/lib/auth";
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, saveImage } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Receives an image chosen from the admin's device.
 *
 * Signed-in only: without the check anyone could fill the database with
 * arbitrary files. The session is verified here rather than relying on
 * middleware, so the guard travels with the route.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "No file was attached." }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return Response.json(
      { error: `${file.type || "That file type"} is not an image we accept. Use JPEG, PNG, WebP, AVIF or GIF.` },
      { status: 415 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const limit = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024));
    return Response.json(
      { error: `That image is ${(file.size / (1024 * 1024)).toFixed(1)} MB. The limit is ${limit} MB.` },
      { status: 413 },
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const saved = await saveImage(input, file.type);
    return Response.json({
      url: saved.url,
      id: saved.id,
      bytes: saved.bytes,
      originalBytes: file.size,
    });
  } catch (error) {
    console.error("[upload] failed:", error);
    return Response.json(
      {
        error:
          "The image could not be saved. If this site has no database connected, uploads cannot persist here.",
      },
      { status: 500 },
    );
  }
}
