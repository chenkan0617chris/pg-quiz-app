import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "宝洁笔试题库 P&G Test Prep",
  description: "P&G aptitude test prep — practice pipeline logic, figure series, and numerical reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full bg-white text-slate-900">
        <I18nProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-4 py-8 sm:px-8">
              <div className="mx-auto w-full max-w-5xl">{children}</div>
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
