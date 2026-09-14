import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social sharing image (§27). Drawn with the brand tokens rather than a static
 * asset so it stays in step with the palette.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0C0C0C",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Brand glow */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: 180,
            width: 840,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(182,0,168,0.34) 0%, rgba(12,12,12,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            MWJ
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8A939B",
            }}
          >
            Software Developer &amp; Web Developer
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#D7E2EA",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#B4C0C9",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            I build management systems, ordering platforms and the software that
            replaces a paper register.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #242424",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#BBCCD7",
            }}
          >
            {site.mission}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#BBCCD7" }}>&lt;/&gt;</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
