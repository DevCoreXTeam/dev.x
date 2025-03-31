import React, { useState } from "react";
import { cn } from "../../lib/utils";
import Button from "../../components/generated/Button";
import Input from "../../components/generated/Input";

export interface LoginCardProps {
  variant?: "neutral" | "inverse" | "outline" | "subtle" | "blurred";
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

const variantClasses: Record<NonNullable<LoginCardProps["variant"]>, string> = {
  neutral:
    "bg-white text-black focus:ring-gray-200 dark:bg-black dark:text-white",
  inverse: "bg-black text-white focus:ring-black dark:bg-white dark:text-black",
  outline:
    "border border-gray-300 text-black bg-transparent focus:ring-gray-200 dark:border-gray-600 dark:text-white",
  subtle:
    "bg-gray-200 text-gray-700 focus:ring-gray-200 dark:bg-gray-600 dark:text-white",
  blurred:
    "bg-black/40 text-white backdrop-blur-sm focus:ring-gray-400 dark:bg-white/40 dark:text-black",
};

export default function LoginCard({
  variant = "neutral",
  onSubmit,
}: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email, password);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-lg px-6 py-10 shadow-lg transition-all duration-300",
        variantClasses[variant],
      )}
    >
      <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="email"
            type="email"
            variant="neutral"
            label="Username or Email"
            placeholder="username or email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNameContainer="my-6"
          />
          <Input
            id="password"
            type="password"
            variant="neutral"
            label="Password"
            placeholder="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            classNameContainer="my-4"
          />
          <div className="mb-2 flex justify-end">
            <Button variant="link" size="sm" href="/forgot" className="text-xs">
              Forgot your password?
            </Button>
          </div>
        </div>
        <Button type="submit" variant="inverse" full={true}>
          Login
        </Button>
      </form>
      <div className="mt-6 flex flex-col items-center text-center">
        <span className="text-sm">Don't have an account?</span>
        <Button variant="link" size="sm" href="/register" className="text-xs">
          Create an account
        </Button>
      </div>
    </div>
  );
}
