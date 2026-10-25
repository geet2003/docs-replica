import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Docs",
  description: "Lightweight collaborative document editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <UserProvider>
          <Header />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
