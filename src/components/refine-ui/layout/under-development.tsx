import { cn } from "@/lib/utils";
import { useTranslate } from "@refinedev/core";
import { Construction } from "lucide-react";

interface UnderDevelopmentProps {
  title: string;
}

export function UnderDevelopment({ title }: UnderDevelopmentProps) {
  const t = useTranslate();
  return (
    <div
      className={cn(
        "h-full",
        "flex",
        "items-center",
        "justify-center",
        "bg-background",
        "my-auto",
      )}
    >
      <div className="flex flex-col items-center justify-center text-slate-400 bg-white text-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <Construction className="w-16 h-16 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">{t("under_development")}</p>
      </div>
    </div>
  );
}
