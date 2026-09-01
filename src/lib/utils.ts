import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Units = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

const MS = 1000;
const UNIT: Record<Units, number> = {
  year: 60 * 60 * 24 * 365,
  month: 60 * 60 * 24 * 30,
  week: 60 * 60 * 24 * 7,
  day: 60 * 60 * 24,
  hour: 60 * 60,
  minute: 60,
  second: 1,
};

export const getPastDate = (num: number, unit: Units): string => {
  return new Date(Date.now() - num * UNIT[unit] * MS).toISOString();
};

export const getRelativeTime = (dateString: string, locale: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (date.getTime() - now.getTime()) / 1000
  );

  for (const [unit, seconds] of Object.entries(UNIT)) {
    if (Math.abs(diffInSeconds) >= seconds) {
      const value = Math.round(diffInSeconds / seconds);

      return new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }).format(value, unit as Units);
    }
  }

  return locale === "id" ? "baru saja" : "just now";
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name = "") => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
};