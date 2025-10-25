"use client";

import { YYCVisualPlatform } from "@/components/visual-programming";
import { ThemeProvider } from "@/components/theme-provider";

export default function VisualProgrammingPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-screen w-screen">
        <YYCVisualPlatform />
      </div>
    </ThemeProvider>
  );
}
