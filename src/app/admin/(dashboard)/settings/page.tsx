import { getSettings } from "@/lib/repo";
import { isWritable } from "@/lib/db";
import { Icon } from "@/components/ui";
import { PageHead } from "../../ui";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [settings, writable] = await Promise.all([getSettings(), isWritable()]);

  return (
    <>
      <PageHead
        title="Settings"
        description="Identity, mission and contact details used across the public site."
      />

      <SettingsForm settings={settings} />

      <section style={{ marginTop: "var(--space-11)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
          Storage
        </h2>
        <div className="card">
          <div className="meta-row">
            <span className="meta-key">Store</span>
            <span className="meta-val">JSON file — data/content.json</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">Writable</span>
            <span className="meta-val">
              {writable ? "Yes" : "No — changes cannot be saved on this host"}
            </span>
          </div>
          <div className="meta-row">
            <span className="meta-key">Settings updated</span>
            <span className="meta-val">
              {new Date(settings.updatedAt).toLocaleString("en-GB")}
            </span>
          </div>
        </div>

        <div className="card danger-zone" style={{ marginTop: "var(--space-5)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <span style={{ color: "var(--danger-500)" }}>
              <Icon name="settings" size={20} />
            </span>
            <div>
              <p style={{ fontWeight: 600 }}>Resetting the content</p>
              <p
                style={{
                  marginTop: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                  lineHeight: "var(--leading-normal)",
                }}
              >
                Deleting <code>data/content.json</code> reseeds everything from the
                files in <code>src/content/</code> the next time a page loads. Stored
                contact messages are in that same file and are not recoverable
                afterwards, so export them first if they matter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
