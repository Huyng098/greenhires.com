"use client";
import { queryClientConfig } from "@/lib/queryClient";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <TooltipProvider delayDuration={400}>{children}</TooltipProvider>
        {/*<ReactQueryDevtools />*/}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
