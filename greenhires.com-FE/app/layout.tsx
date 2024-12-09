"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/stores/auth";
import { SavingProvider } from "@/stores/saving";
import { ThemeProvider, createTheme } from "@mui/material";
import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import ReactQueryProvider from "./provider";
const montserrat = Montserrat({
  subsets: ["vietnamese"],
  preload: true,
  fallback: ["Quicksand"],
});
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" href="favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <ThemeProvider theme={theme}>
        <body className={`bg-white ${montserrat.className}`}>
          <NextTopLoader color="#2F566B" />
          <Toaster position="top-right" richColors closeButton />
          <ReactQueryProvider>
            <AuthProvider>
              <SavingProvider>{children}</SavingProvider>
            </AuthProvider>
            <ScrollToTop />
          </ReactQueryProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
