import type { InputHTMLAttributes } from "react";

export interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
