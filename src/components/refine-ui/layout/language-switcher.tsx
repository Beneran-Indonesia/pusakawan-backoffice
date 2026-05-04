import { Languages } from "lucide-react";
import Flag from 'react-flagpack'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTranslation as useTranslationRefine } from "@refinedev/core";
import { useTranslation as useTranslationReact } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslationReact();
  const { translate, changeLocale } = useTranslationRefine();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full",
            "border-sidebar-border",
            "bg-transparent",
            "h-10",
            "w-10",
          )}
        >
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[...(i18n.languages || [])].sort().map((lang: string) => (
          <DropdownMenuItem key={lang} onClick={() => changeLocale(lang)}>
            <Flag
              code={lang.toUpperCase()}
              size="m"
            />
            <p className={cn("text-destructive", "hover:text-destructive")}>
              {translate(`header.language_switcher.${lang}`)}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

LanguageSwitcher.displayName = "LanguageSwitcher";
