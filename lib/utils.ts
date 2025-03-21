import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`.trim();
  } else {
    return `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
}

export function formatDateToYYYYMMDD(date: { day: number; month: number; year: number }): string {
  const { day, month, year } = date;
  const formattedDay = day.toString().padStart(2, '0');
  const formattedMonth = (month + 1).toString().padStart(2, '0'); // month is 0-indexed
  return `${year}-${formattedMonth}-${formattedDay}`;
}
