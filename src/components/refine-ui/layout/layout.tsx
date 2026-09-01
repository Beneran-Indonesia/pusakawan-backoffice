"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";
import { useCan, useIsAuthenticated, useResourceParams } from "@refinedev/core";
import { Navigate } from "react-router";
import { LoadingSpinner } from "@/components/Loading";
// import { LoadingOverlay } from "./loading-overlay";

export function Layout({ children }: PropsWithChildren) {
  const { data: user, isLoading: authLoading } = useIsAuthenticated();
  const { resource } = useResourceParams();

  const authenticated = !authLoading && (user?.authenticated === true);
  const parentResource = resource?.meta?.parent;

  const { data: canData, isLoading: canLoading } = useCan({
    resource: parentResource,
    action: "access",
    queryOptions: {
      enabled: !!parentResource && authenticated,
    },
  });

  if (authLoading || canLoading) {
    return <LoadingSpinner />
  }

  // Auth initialization finished and there's no user.
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (!canLoading && !canData?.can) {
    return <Navigate to="/" replace />;
  }

  return (
    // <Authenticated fallback={<Navigate to="/" replace />} key="layout">
    <ThemeProvider>
      {/* <LoadingOverlay loading={authLoading || canLoading}> */}
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
                "lg:pb-6",
              )}
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      {/* </LoadingOverlay> */}
    </ThemeProvider>
    // </Authenticated>
  );
}

Layout.displayName = "Layout";
