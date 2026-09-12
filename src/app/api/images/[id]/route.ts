import { getImage } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Serves an uploaded image.
 *
 * Public on purpose — these appear in project galleries on the public site.
 * Ids are random UUIDs and content is immutable once written, so the response
 * can be cached indefinitely.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await getImage(id);

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
