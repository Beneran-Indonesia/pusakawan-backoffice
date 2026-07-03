"use client";

import { Smartphone, Monitor, ListIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useMenu,
  CanAccess,
  type TreeMenuItem,
  useGetIdentity,
} from "@refinedev/core";
import {
  SidebarRail as ShadcnSidebarRail,
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  useSidebar as useShadcnSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { data } = useGetIdentity();
  const { open } = useShadcnSidebar();
  const { menuItems, selectedKey } = useMenu();
  const [platform, setPlatform] = useState<"LMS" | "APP">("APP");
  // changing the platform according to user's role :)
  useEffect(() => {
    if (data?.role === "LMS") {
      setPlatform("LMS");
    }
  }, [data]);

  const PLATFORM_RULES = {
    APP: (item: TreeMenuItem) => item.name === "APP",
    LMS: (item: TreeMenuItem) => item.name === "LMS",
  };

  const filteredPlatform = menuItems.find(PLATFORM_RULES[platform]) ?? null;
  const manageUserNav =
    menuItems.find((it) => it.name === "MANAGE_USERS") ?? null;

  return (
    <ShadcnSidebar
      collapsible="offcanvas"
      className={cn("bg-white", "border-r", "border-slate-200")}
    >
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          "px-3",
          "py-6",
          "space-y-6",
          {
            "px-3": open,
            "px-2": !open,
          },
          "flex h-screen bg-slate-50 font-sans text-slate-900",
        )}
      >
        <div className="bg-slate-100 p-1 rounded-lg flex">
          <PlatformToggleButton
            isActive={platform === "APP"}
            onClick={() => setPlatform("APP")}
            icon={<Smartphone className="w-3.5 h-3.5" />}
          >
            APP
          </PlatformToggleButton>
          <PlatformToggleButton
            isActive={platform === "LMS"}
            onClick={() => setPlatform("LMS")}
            icon={<Monitor className="w-3.5 h-3.5" />}
          >
            LMS
          </PlatformToggleButton>
        </div>
        <nav className="space-y-1 h-full flex flex-col">
          {filteredPlatform &&
            filteredPlatform.children.map((item: TreeMenuItem) => (
              <CanAccess
                action="menu-bar"
                key={`menu-bar-${item.key}`}
              >
                <SidebarButton
                  key={item.key}
                  item={item}
                  isSelected={selectedKey == item.key}
                  // onClick={}
                />
              </CanAccess>
            ))}
          {/* Manage Users - Only for Super Admin */}
          {manageUserNav && (
            <CanAccess action="menu-bar">
              <div className="mt-auto border-t border-t-gray-200 pt-2">
                <SidebarButton
                  key={manageUserNav.key}
                  item={manageUserNav.children[0]}
                  isSelected={selectedKey == manageUserNav.key}
                />
              </div>
            </CanAccess>
          )}
        </nav>
      </ShadcnSidebarContent>
    </ShadcnSidebar>
  );
}

type PlatformToggleButtonProps = {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  title?: string;
};

function PlatformToggleButton({
  isActive,
  onClick,
  icon,
  children,
  title,
}: PlatformToggleButtonProps) {
  return (
    <button
      title={title}
      className={cn(
        "cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all duration-200",
        isActive
          ? "bg-white text-red-700 shadow-sm"
          : "text-slate-500 hover:text-slate-700",
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {children}
    </button>
  );
}

function SidebarHeader() {
  const { open } = useShadcnSidebar();

  return (
    <ShadcnSidebarHeader
      className={cn(
        "p-6",
        "pb-4",
        "flex",
        "items-center",
        "justify-center",
        "border-b",
        "border-slate-100",
      )}
    >
      <div
        className={cn(
          "flex",
          "items-center",
          "justify-center",
          "transition-opacity",
          "duration-200",
          { "opacity-0": !open, "opacity-100": open },
        )}
      >
        <img
          src="/pusakawan.svg"
          alt="Pusakawan Logo"
          className="h-12 w-auto object-contain"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(14%) sepia(85%) saturate(3033%) hue-rotate(346deg) brightness(85%) contrast(105%)",
          }}
        />
      </div>
    </ShadcnSidebarHeader>
  );
}

function getDisplayName(item: TreeMenuItem) {
  return item.meta?.label ?? item.label ?? item.name;
}

type IconProps = {
  icon: React.ReactNode;
  isSelected?: boolean;
};

function ItemIcon({ icon, isSelected }: IconProps) {
  return (
    <span className={`mr-3 ${isSelected ? "text-white" : ""}`}>
      {icon ?? <ListIcon />}
    </span>
  );
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
  item: TreeMenuItem;
  isSelected?: boolean;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  onClick?: () => void;
};

function SidebarButton({
  item,
  isSelected = false,
  rightIcon,
  className,
  onClick,
  ...props
}: SidebarButtonProps) {

  const buttonContent = (
    <>
      <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
      <span>{getDisplayName(item)}</span>
      {rightIcon}
    </>
  );

  return (
    <button
      className={cn(
        "font-bold",
        "items-center",
        "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        isSelected
          ? "bg-red-700 text-white shadow-md shadow-red-200"
          : "text-slate-600 hover:bg-red-50 hover:text-red-700",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {
        buttonContent
      }
    </button>
  );
}

Sidebar.displayName = "Sidebar";
