import type { ComponentProps } from "react";
import { cn } from "cn";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <div className="w-full overflow-x-auto border border-border"><table {...props} data-slot="table" className={cn("w-full caption-bottom text-left text-sm text-foreground", className)} /></div>;
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead {...props} data-slot="table-header" className={cn("bg-muted text-muted-foreground [&_tr]:border-b", className)} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody {...props} data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot {...props} data-slot="table-footer" className={cn("border-t border-border bg-muted font-medium", className)} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr {...props} data-slot="table-row" className={cn("border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} />;
}

export function TableHead({ className, scope = "col", ...props }: ComponentProps<"th">) {
  return <th {...props} scope={scope} data-slot="table-head" className={cn("px-4 py-3 align-middle font-medium", className)} />;
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td {...props} data-slot="table-cell" className={cn("px-4 py-3 align-top", className)} />;
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption {...props} data-slot="table-caption" className={cn("border-t border-border px-4 py-3 text-sm text-muted-foreground", className)} />;
}
