import { Providers } from "@/store/providers";
import React from "react";
import MyApp from "./app";
import "./global.css";

export const metadata = {
  title: "Toocans",
  description: "Toocans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}
