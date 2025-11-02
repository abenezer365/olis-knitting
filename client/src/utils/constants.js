import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function truncate(text, maxLength) {
  const string = new String(text)
  if (string.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function currency(price){
  return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(price)
}

export function formatPrice(price) {
    if (currency === "ETB") {
      return `${(price * 50).toFixed(0)} ${currency}`;
    }
    return `$${price}`;
  };

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
