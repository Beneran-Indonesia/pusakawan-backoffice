"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";
import { Authenticated } from "@refinedev/core";
import { Navigate } from "react-router";

export function Layout({ children }: PropsWithChildren) {
  
  return (
    <Authenticated fallback={<Navigate to="/" replace />} key="layout">
      <ThemeProvider>
        <SidebarProvider>
          <Sidebar />
          <SidebarInset>
            <Header />
            <main
              className={cn(
                "@container/main",
                "container",
                "mx-auto",
                "relative",
                "w-full",
                "flex",
                "flex-col",
                "flex-1",
                "px-2",
                "pt-4",
                "md:p-4",
                "lg:px-6",
                "lg:pt-6",
              )}
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </Authenticated>
  );
}

Layout.displayName = "Layout";
