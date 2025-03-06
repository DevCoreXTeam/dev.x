import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "neutral" | "inverse" | "outline" | "subtle" | "blurred";
  className?: string;
  classNameContainer?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

const variantClasses = {
  neutral: "border border-gray-200 bg-white text-black focus:ring-gray-200 dark:border-gray-700 dark:bg-black dark:text-white",
  inverse: "border border-gray-700 bg-black text-white focus:ring-black dark:border-gray-200 dark:bg-white dark:text-black",
  outline: "border border-gray-300 bg-transparent text-black focus:ring-gray-200 dark:border-gray-600 dark:text-white",
  subtle: "border border-gray-300 bg-gray-200 text-gray-700 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-white",
  blurred: "border border-gray-300 bg-black/40 text-white backdrop-blur-sm focus:ring-gray-400 dark:border-gray-600 dark:bg-white/40 dark:text-black",
};

export default React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "neutral", className, classNameContainer, label, error, helperText, ...props },
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div className={cn("flex flex-col space-y-1", classNameContainer)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md px-4 py-2 focus:ring-2 focus:outline-none transition",
          variantClasses[variant],
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
