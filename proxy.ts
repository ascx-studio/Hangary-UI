import { NextResponse, type NextRequest } from "next/server";
import { markdownNotFound, markdownPage, prefersMarkdown } from "@/lib/agent-content";

export function proxy(request: NextRequest) {
  if (!["GET", "HEAD"].includes(request.method)) return NextResponse.next();
  if (prefersMarkdown(request.headers.get("accept") ?? "")) {
    const content = markdownPage(request.nextUrl.pathname);
    return new NextResponse(request.method === "HEAD" ? null : (content ?? markdownNotFound), {
      status: content ? 200 : 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }
  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|ingest|r/|.*\\..*).*)"],
};
