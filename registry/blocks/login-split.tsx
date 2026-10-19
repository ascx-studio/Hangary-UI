"use client";

import type { ComponentProps, ReactNode } from "react";
import { LoginMinimal } from "./login-minimal";

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

export function LoginSplit({ brand = "Studio", ...props }: LoginProps = {}) {
  return (
    <div data-slot="login" data-layout="split" className="@container w-full">
      <div className="grid grid-cols-1 bg-card @xl:min-h-144 @xl:grid-cols-2">
        <aside
          className="relative isolate flex min-w-0 flex-col justify-between gap-4 overflow-hidden border-b border-border bg-cover bg-center bg-no-repeat p-4 text-white @xl:border-r @xl:border-b-0"
          style={{ backgroundImage: `url("/2.png")` }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />


        </aside>
        <div className="min-w-0 @xl:flex @xl:flex-col @xl:justify-center">
          <LoginMinimal {...props} brand={brand} />
        </div>
      </div>
    </div>
  );
}
