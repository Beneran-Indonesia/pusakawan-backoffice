import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookieValue = (cookie: string, key: string) =>
  cookie.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${key}=`))
    ?.split("=")[1];
