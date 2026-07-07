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


export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};