"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Google, GitHubDark } from "@ridemountainpig/svgl-react";
import { cn } from "cn";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";
import { Banner } from "../components/banner";
import { Blockquote } from "../components/blockquote";
import { Button } from "../components/button";
import { Card } from "../components/card";

interface LoginProps extends Omit<ComponentProps<"form">, "title" | "action"> {
  title?: string;
  description?: string;
  brand?: string;
  showSocial?: boolean;
  onProviderLogin?: (provider: "google" | "github") => void;
  loading?: boolean;
  error?: string;
  forgotPasswordHref?: string;
  signupHref?: string;
}

function LoginLayout({ layout, title = "Welcome back", description = "Sign in to pick up where you left off.", brand = "Studio", showSocial = true, onProviderLogin, loading = false, error, forgotPasswordHref = "/forgot-password", signupHref = "/signup", onSubmit, className, children, ...props }: LoginProps & { layout: "card" | "split" | "minimal" }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div data-slot="login" data-layout={layout} className="@container w-full">
      <div className={cn(layout === "split" && "grid grid-cols-1 border border-border bg-card @xl:min-h-144 @xl:grid-cols-2")}>
      {layout === "split" && <aside className="flex min-w-0 flex-col justify-between gap-10 border-b border-border bg-muted p-8 @xl:border-r @xl:border-b-0">
        <div className="flex items-center gap-3"><span className="text-xl font-semibold">{brand}</span><Badge variant="neutral">Workspace</Badge></div>
        <div><Blockquote quote="A little less friction. A lot more room to create." author="Alex Morgan" source="Designer" /><div className="mt-6"><Avatar name="Alex Morgan" size={40} /></div></div>
      </aside>}
      <Card title={title} description={description} variant={layout === "minimal" ? "ghost" : "secondary"} className={cn("mx-auto max-w-md!", layout === "split" && "m-0! min-w-0 max-w-none! border-0 p-6 shadow-none @xl:flex @xl:flex-col @xl:justify-center @xl:p-10", layout === "minimal" && "border-0 shadow-none")}>
        <form {...props} aria-label={props["aria-label"] ?? title} className={cn("space-y-5", className)} onSubmit={event => { event.preventDefault(); onSubmit?.(event); }}>
          {error && <div role="alert"><Banner variant="destructive" dismissible={false} message={error} /></div>}
          {showSocial && <div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" disabled={loading || !onProviderLogin} onClick={() => onProviderLogin?.("google")}><Google width={16} height={16} aria-hidden="true" />Google</Button>
              <Button variant="outline" disabled={loading || !onProviderLogin} onClick={() => onProviderLogin?.("github")}><GitHubDark width={16} height={16} aria-hidden="true" />GitHub</Button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />Or continue with email<span className="h-px flex-1 bg-border" /></div>
          </div>}
          <div className="space-y-2">
            <label htmlFor={`${id}-email`} className="block text-sm font-medium">Email</label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={loading} className="min-h-11 w-full border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3"><label htmlFor={`${id}-password`} className="text-sm font-medium">Password</label>{forgotPasswordHref && <a href={forgotPasswordHref} className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">Forgot password?</a>}</div>
            <div className="relative">
              <input id={`${id}-password`} name="password" type={visible ? "text" : "password"} autoComplete="current-password" required disabled={loading} className="min-h-11 w-full border border-border bg-background pr-12 pl-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50" />
              <Button variant="ghost" className="absolute inset-y-0 right-0 px-3" disabled={loading} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}</Button>
            </div>
          </div>
          {children}
          <Button type="submit" className="w-full" disabled={loading || !onSubmit} aria-busy={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          {signupHref && <p className="text-center text-xs text-muted-foreground">New here? <a href={signupHref} className="font-medium text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring">Create an account</a></p>}
        </form>
      </Card>
      </div>
    </div>
  );
}

export function Login(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="card" />;
}

export function LoginSplit(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="split" />;
}

export function LoginMinimal(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="minimal" />;
}
