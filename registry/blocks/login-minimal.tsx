"use client";

import { typography } from "../lib/typography.shared";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Google, GitHubDark } from "@ridemountainpig/svgl-react";
import { cn } from "cn";
import { Banner } from "../components/banner";
import { Button } from "../components/button";
import { Card } from "../components/card";

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

export function LoginMinimal({ title = "Welcome back", description = "Sign in to pick up where you left off.", brand = "Studio", logo = <Image src="/logo.svg" alt={`${brand} logo`} width={40} height={40} className="size-10" />, showSocial = true, onProviderLogin, loading = false, error, forgotPasswordHref = "/forgot-password", signupHref = "/signup", helpHref = "/help", termsHref = "/terms", privacyHref = "/privacy", onSubmit, className, children, ...props }: LoginProps = {}) {
  return (<div data-slot="login" data-layout="minimal" className="@container w-full">
    <div>
      <Card title="" description="" className={cn("mx-auto max-w-md!", "border-0! bg-transparent! p-6! @sm:p-10! text-foreground shadow-none!")}>
        {logo && <div className="mb-6">{logo}</div>}
        {title && <h2 className={typography.sectionTitle}>{title}</h2>}
        {description && <p className={`mt-2 ${typography.body}`}>{description}</p>}
        <div className="mt-8">
          <LoginForm {...props} title={title} showSocial={showSocial} onProviderLogin={onProviderLogin} loading={loading} error={error} forgotPasswordHref={forgotPasswordHref} signupHref={signupHref} onSubmit={onSubmit} className={className}>{children}</LoginForm>
        </div>
        {(helpHref || termsHref || privacyHref) && (
          <footer className="mt-8">
            <nav aria-label="Login resources" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs leading-6 text-muted-foreground">
              {[["Help", helpHref], ["Terms", termsHref], ["Privacy", privacyHref]].filter(([, href]) => href).map(([label, href], index) => (
                <span key={label} className="inline-flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <a href={href} className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                    {label}
                  </a>
                </span>
              ))}
            </nav>
          </footer>
        )}
      </Card>
    </div>
  </div>);
}
function LoginForm({
  title,
  showSocial,
  onProviderLogin,
  loading,
  error,
  forgotPasswordHref,
  signupHref,
  onSubmit,
  className,
  children,
  ...props
}: Readonly<LoginProps>) {
  const id = useId();
  return (
    <form
      {...props}
      aria-label={props["aria-label"] ?? title}
      className={cn("space-y-6", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
    >
      {error && (
        <div role="alert">
          <Banner variant="error" dismissible={false} message={error} />
        </div>
      )}
      {showSocial && (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="px-4! font-medium!"
              disabled={loading || !onProviderLogin}
              onClick={() => onProviderLogin?.("google")}
            >
              <Google width={16} height={16} aria-hidden="true" />
              Google
            </Button>
            <Button
              variant="outline"
              className="px-4! font-medium!"
              disabled={loading || !onProviderLogin}
              onClick={() => onProviderLogin?.("github")}
            >
              <GitHubDark width={16} height={16} aria-hidden="true" />
              GitHub
            </Button>
          </div>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Or continue with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor={`${id}-email`} className="block text-sm font-medium">
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={loading}
          className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
        />
      </div>
      <PasswordField
        id={id}
        loading={loading}
        forgotPasswordHref={forgotPasswordHref}
      />
      {children}
      <Button
        type="submit"
        className="w-full px-4!"
        disabled={loading || !onSubmit}
        aria-busy={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      {signupHref && (
        <p className="text-center text-sm leading-6 text-muted-foreground">
          New here?{" "}
          <a
            href={signupHref}
            className="font-medium text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Create an account
          </a>
        </p>
      )}
    </form>
  );
}
function PasswordField({
  id,
  loading,
  forgotPasswordHref,
}: Readonly<{
  id: string;
  loading?: boolean;
  forgotPasswordHref?: string;
}>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`${id}-password`} className="text-sm font-medium">
          Password
        </label>
        {forgotPasswordHref && (
          <a
            href={forgotPasswordHref}
            className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            Forgot password?
          </a>
        )}
      </div>
      <div className="flex items-center border border-border bg-background focus-within:outline-2 focus-within:outline-ring">
        <input
          id={`${id}-password`}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          required
          disabled={loading}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none disabled:opacity-50"
        />
        <Button
          variant="ghost"
          className="shrink-0 px-3!"
          disabled={loading}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
