import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your account and preferences.
      </p>

      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <div className="text-3xl mb-3">⚙️</div>
        <p className="text-sm text-muted-foreground/70">Settings coming soon.</p>
      </div>
    </div>
  );
}
