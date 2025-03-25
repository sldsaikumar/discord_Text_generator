"use client"; // Ensure this is a Client Component

import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Ensure Mantine theme matches on both server and client
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // This ensures the color scheme is applied properly after hydration
    const savedScheme = localStorage.getItem("mantine-color-scheme") as "light" | "dark";
    if (savedScheme) setColorScheme(savedScheme);
  }, []);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        <MantineProvider defaultColorScheme={colorScheme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
