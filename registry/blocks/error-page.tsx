import { memo, type ComponentProps } from "react";
import { Button } from "@/registry/components/button";

export type ErrorPageProps = ComponentProps<"main">;

export const ErrorPage = memo(function ErrorPage({ className = "", ...props }: ErrorPageProps) {
  return (
    <main
      {...props}
      className={`flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground ${className}`}
    >
      <section className="flex w-full max-w-md flex-col items-center text-center">
        <svg
          aria-label="Confused character illustration"
          role="img"
          width="165"
          height="167"
          viewBox="0 0 165 167"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-10 h-auto w-80 sm:w-96"
        >
          <path
            d="M24.25 48C37.5048 48 48.25 37.2548 48.25 24C48.25 10.7452 37.5048 0 24.25 0C10.9952 0 0.25 10.7452 0.25 24C0.25 37.2548 10.9952 48 24.25 48Z"
            fill="#232323"
          />
          <path
            d="M140.25 48C153.505 48 164.25 37.2548 164.25 24C164.25 10.7452 153.505 0 140.25 0C126.995 0 116.25 10.7452 116.25 24C116.25 37.2548 126.995 48 140.25 48Z"
            fill="#232323"
          />
          <path
            d="M82.25 162C125.328 162 160.25 127.078 160.25 84C160.25 40.9218 125.328 6 82.25 6C39.1718 6 4.25 40.9218 4.25 84C4.25 127.078 39.1718 162 82.25 162Z"
            fill="white"
            strokeWidth="8.5"
            stroke="#232323"
          />
          <path
            d="M68.25 60C44.25 59 24.25 76 24.25 96C24.25 110 32.25 118 44.25 114C53.25 111 61.25 81 68.25 60Z"
            fill="#232323"
          />
          <path
            d="M41.25 95C44.0114 95 46.25 92.7614 46.25 90C46.25 87.2386 44.0114 85 41.25 85C38.4886 85 36.25 87.2386 36.25 90C36.25 92.7614 38.4886 95 41.25 95Z"
            fill="white"
          />
          <path
            d="M92.25 60C115.25 62 141.25 83 134.25 114C134.25 94 119.25 77 102.25 67C118.25 78 131.25 95 132.25 116C114.25 109 106.25 80 92.25 60Z"
            fill="#7CB82F"
          />
          <path
            d="M72.25 96C72.25 91 92.25 91 92.25 96C92.25 103 86.25 109 82.25 109C78.25 109 72.25 103 72.25 96Z"
            fill="#09090B"
          />
          <path
            d="M42.25 99C47.2206 99 51.25 94.9706 51.25 90C51.25 85.0294 47.2206 81 42.25 81C37.2794 81 33.25 85.0294 33.25 90C33.25 94.9706 37.2794 99 42.25 99Z"
            fill="#232323"
          />
          <path
            d="M38.25 87L46.25 95M46.25 87L38.25 95"
            strokeWidth="2.8"
            strokeLinecap="round"
            stroke="white"
          />
          <path
            d="M64.25 114C70.25 109.333 76.25 109.333 82.25 114C88.25 118.667 94.25 118.667 100.25 114"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="#232323"
          />
        </svg>

        <h1 className="typography-page-title">404 Not Found</h1>
        <p className="mt-4 typography-body">
          The page you’re looking for may have moved, or the link might be a little off.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="secondary">
            Back to home
          </Button>
          <Button href="/components">Components</Button>
        </div>
      </section>
    </main>
  );
});
