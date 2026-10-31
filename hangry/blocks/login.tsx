"use client";

import type { ComponentProps, ReactNode } from "react";
import { LoginMinimal } from "@/hangry/blocks/login-minimal";

interface LoginProps extends Omit<ComponentProps<"form">, "title" | "action"> {
  title?: string;
  description?: string;
  brand?: string;
  logo?: ReactNode;
  showSocial?: boolean;
  onProviderLogin?: (provider: "google" | "github") => void;
  loading?: boolean;
  error?: string;
  forgotPasswordHref?: string;
  signupHref?: string;
  helpHref?: string;
  termsHref?: string;
  privacyHref?: string;
}

export function Login(props: LoginProps = {}) {
  return (
    <div
      data-slot="login"
      data-layout="card"
      className="@container relative isolate grid h-full w-full place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url("/image.png")` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
      />
      <div className="relative z-10 w-full max-w-md border border-border bg-card text-card-foreground shadow-sm">
        <LoginMinimal {...props} />
      </div>
    </div>
  );
}
