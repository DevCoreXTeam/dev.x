"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/generated/Button";
import Input from "@/components/generated/Input";

const variantClasses = {
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

export default function RegisterCard({ variant = "neutral", onSubmit, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    if (onSubmit) {
      onSubmit(name, email, password, confirmPassword);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-xl px-8 py-12 shadow-xl transition-all duration-300 sm:px-10",
        variantClasses[variant],
      )}
    >
      <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-200">
            {error}
          </div>
        )}
        <div>
          <Input
            id="name"
            type="text"
            variant="neutral"
            label="Full Name"
            placeholder="Your full name"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            classNameContainer="my-4"
          />
          <Input
            id="email"
            type="email"
            variant="neutral"
            label="Email Address"
            placeholder="your@email.com"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNameContainer="my-4"
          />
          <Input
            id="password"
            type="password"
            variant="neutral"
            label="Password"
            placeholder="Create a password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            classNameContainer="my-4"
          />
          <Input
            id="confirmPassword"
            type="password"
            variant="neutral"
            label="Confirm Password"
            placeholder="Confirm your password"
            required={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            classNameContainer="my-4"
          />
        </div>
        <Button
          type="submit"
          variant="inverse"
          full={true}
          className="py-2.5 sm:py-3 text-sm sm:text-base font-medium"
        >
          Create Account
        </Button>
      </form>
      <div className="mt-8 flex flex-col items-center text-center">
        <span className="text-sm sm:text-base">Already have an account?</span>
        <Button variant="link" size="sm" href="/auth/login" className="text-xs sm:text-sm mt-1" onClick={onLogin}>
          Login to your account
        </Button>
      </div>
    </div>
  );
}
