import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatAddress(address?: string) {
    if (!address) return "";
    return address.slice(0, 6) + "..." + address.slice(-4);
}

export const formatMarketCap = (value?: number | string) => {
    if (!value) return "N/A";

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (num >= 1e9) {
        return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `${(num / 1e3).toFixed(2)}K`;
    }

    return num.toFixed(2);
};