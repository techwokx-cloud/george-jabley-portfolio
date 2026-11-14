import type { Metadata, Viewport } from "next";
import "./admin.css";
import PwaRegister from "./PwaRegister";

export const metadata: Metadata = {
  title: "Admin · George Jabley",
  robots: { index: false, follow: false },
  manifest: "/admin/manifest.webmanifest",
  icons: { icon: "/icons/admin-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "GJ Admin", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff7210",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <PwaRegister />
      {children}
    </div>
  );
}
