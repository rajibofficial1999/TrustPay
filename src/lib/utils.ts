import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseErrors = (errors: any) => {
  let message = "";

  if (errors.response?.data?.message) {
    message = errors.response.data.message;
  } else {
    message = errors.message;
  }

  return message;
};

export const formatted = (date: string) =>
  format(new Date(date), "d MMMM yyyy, 'at' h:mm a");

export const isStrongPassword = (password: string) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
