import { format, getTime, formatDistanceToNow } from "date-fns";

export function fDate(date: string | number | Date): string {
    return format(new Date(date), "dd MMMM yyyy"); 
}

export function fDateToMonthYear(date: string | number | Date): string {
    return format(new Date(date), "MMMM yyyy");
}

export function fDateTime(date: string | number | Date): string {
    return format(new Date(date), "dd MMMM yyyy HH:mm"); 
}

export function fTimestamp(date: string | number | Date): number {
    return getTime(new Date(date)); 
}

export function fDateTimeSuffix(date: string | number | Date): string {
    return format(new Date(date), "dd/MM/yyyy hh:mm p"); 
}

export function fToNow(date: string | number | Date): string {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true, 
    });
}