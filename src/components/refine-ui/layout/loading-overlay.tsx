"use client";

import * as React from "react";
import { LoadingSpinner } from "@/components/Loading";

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(({ loading = false, children, ...props }, ref) => {
  if (!loading) return children;

  return (
    <div className="relative" ref={ref} {...props}>
      {children}
      <LoadingSpinner />
    </div>
  );
});

LoadingOverlay.displayName = "LoadingOverlay";
