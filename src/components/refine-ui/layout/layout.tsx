"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";
import {
  Authenticated,
  useCan,
  useResourceParams,
} from "@refinedev/core";
import { Navigate } from "react-router";
import { LoadingOverlay } from "./loading-overlay";

export function Layout({ children }: PropsWithChildren) {
  const { resource } = useResourceParams();
  const { data, isLoading } = useCan({
    resource: resource?.meta?.parent,
    action: "access",
  });

  if (!data?.can) {
    return <Navigate to="/" replace />;
  }

  return (
    <Authenticated fallback={<Navigate to="/" replace />} key="layout">
      <ThemeProvider>
        <LoadingOverlay loading={isLoading}>
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
        </LoadingOverlay>
      </ThemeProvider>
    </Authenticated>
  );
}

Layout.displayName = "Layout";
