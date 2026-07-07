"use client";

import type { PropsWithChildren } from "react";

import {
  useResourceParams,
  useTranslate,
  useUserFriendlyName,
} from "@refinedev/core";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { cn } from "@/lib/utils";

type ListViewProps = PropsWithChildren<{
  className?: string;
}>;

export function ListView({ children, className }: ListViewProps) {
  return (
    <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
  );
}

type ListHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  canCreate?: boolean;
  headerClassName?: string;
  wrapperClassName?: string;
}>;

export const ListViewHeader = ({
  canCreate,
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}: ListHeaderProps) => {
  const t = useTranslate();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });
  const resourceName = identifier ?? resource?.name;

  const translateKey =
    `${resource?.meta?.parent}.${resource?.meta?.label}`.toLowerCase();

  const isCreateButtonVisible = canCreate ?? !!resource?.create;

  return (
    <div className={cn("flex flex-col", "gap-1", wrapperClassName)}>
      <div className={cn("flex", "justify-between", "gap-4", headerClassName)}>
        <h1 className="text-3xl font-bold text-slate-800">
          {t(translateKey + ".title")}
        </h1>
        {isCreateButtonVisible && (
          <div className="flex items-center gap-2">
            <CreateButton size="lg" resource={resourceName} />
          </div>
        )}
      </div>
      <p className="text-slate-600 mt-1">{t(translateKey + ".subtitle")}</p>
    </div>
  );
};

ListView.displayName = "ListView";
