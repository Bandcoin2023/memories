"use client";

import React from "react";

import "./style.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    "auth-button",
    variant ? `auth-button--${variant}` : "",
    size ? `auth-button--${size}` : "",
    fullWidth ? "auth-button--full-width" : "",
    loading ? "auth-button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && <div className="auth-button__spinner" />}
      <span className={loading ? "auth-button__loading-text" : ""}>
        {children}
      </span>
    </button>
  );
}
