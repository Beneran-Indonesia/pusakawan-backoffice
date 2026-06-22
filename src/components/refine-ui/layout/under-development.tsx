import { useTranslate } from '@refinedev/core';
import { Construction } from 'lucide-react';

interface UnderDevelopmentProps {
  title: string;
}

export function UnderDevelopment({ title }: UnderDevelopmentProps) {
  const t = useTranslate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 bg-white rounded-xl border border-slate-200 p-8 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <Construction className="w-16 h-16 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">
        {t("under_development")}
      </p>
    </div>
  );
}
