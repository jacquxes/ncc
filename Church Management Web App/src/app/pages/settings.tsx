import { Bell, Lock, Globe, Palette } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1>Settings</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Manage your application preferences and configurations.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {[
          {
            icon: Bell,
            title: "Notifications",
            desc: "Configure email and push notification preferences.",
          },
          {
            icon: Lock,
            title: "Privacy & Security",
            desc: "Manage access controls and data privacy settings.",
          },
          {
            icon: Globe,
            title: "General",
            desc: "Church name, timezone, and regional settings.",
          },
          {
            icon: Palette,
            title: "Appearance",
            desc: "Theme, branding, and display options.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-lg border border-border shadow-sm p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-foreground">{item.title}</div>
              <div className="text-[13px] text-muted-foreground">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
