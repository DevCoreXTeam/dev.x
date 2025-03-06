import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Button({
  children,
  href,
  disabled = false,
  className = "",
  variant = "neutral",
  status = "idle",
  statusLabel = "",
  size = "md",
  icon = false,
  full = false,
  onClick,
  ...rest
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none";

  const sizes = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const iconSize = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  const variants = {
    neutral:
      "bg-white text-black hover:bg-gray-100 focus:ring-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800",
    inverse:
      "bg-black text-white hover:bg-black/80 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-gray-200",
    outline:
      "border border-gray-300 text-black bg-transparent hover:bg-gray-100 focus:ring-gray-200 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800",
    subtle:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700",
    success:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 dark:bg-green-600 dark:text-white dark:hover:bg-green-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 dark:bg-red-700 dark:text-black dark:hover:bg-red-800",
    link: "text-black underline underline-offset-4 hover:underline focus:ring-transparent dark:text-white dark:hover:text-gray-300",
    disabled:
      "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50 dark:bg-gray-700 dark:text-gray-500",
  };

  const statusClasses = status !== "idle" ? "opacity-75 cursor-wait" : "";
  const widthClass = full ? "w-full" : "";

  const combinedClasses = cn(
    baseClasses,
    icon ? iconSize[size] : sizes[size],
    variants[variant],
    statusClasses,
    disabled ? "opacity-50 cursor-not-allowed" : "",
    widthClass,
    className,
  );

  const content =
    status === "loading" ? (
      <span>{statusLabel || "Loading..."}</span>
    ) : status !== "idle" ? (
      <span>{statusLabel}</span>
    ) : (
      children
    );

  const handleClick = !disabled && status === "idle" ? onClick : undefined;

  if (href) {
    return (
      <motion.a
        whileTap={{ scale: 0.95 }}
        {...rest}
        href={href}
        className={combinedClasses}
        aria-disabled={disabled || status !== "idle"}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      {...rest}
      onClick={handleClick}
      disabled={disabled || status !== "idle"}
      className={combinedClasses}
    >
      {content}
    </motion.button>
  );
}
