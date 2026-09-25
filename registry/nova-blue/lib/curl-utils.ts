export const colors = {
  GREEN: "\x1b[38;5;82m",
  YELLOW: "\x1b[38;5;226m",
  CYAN: "\x1b[38;5;51m",
  LIGHT_CYAN: "\x1b[38;5;87m",
  RED: "\x1b[38;5;196m",
  PURPLE: "\x1b[38;5;141m",
  BLUE: "\x1b[38;5;27m",
  BRIGHT_BLUE: "\x1b[38;5;75m",
  ORANGE: "\x1b[38;5;208m",
  PINK: "\x1b[38;5;213m",

  DARK_BLUE: "\x1b[38;5;17m",
  DEEP_PURPLE: "\x1b[38;5;93m",
  LIGHT_PURPLE: "\x1b[38;5;183m",
  DARK_CYAN: "\x1b[38;5;30m",
  BRIGHT_CYAN: "\x1b[38;5;123m",
  GOLD: "\x1b[38;5;220m",
  LIGHT_YELLOW: "\x1b[38;5;228m",

  WHITE: "\x1b[38;5;231m",
  LIGHT_GRAY: "\x1b[38;5;250m",
  GRAY: "\x1b[38;5;244m",
  DARK_GRAY: "\x1b[38;5;238m",

  BOLD: "\x1b[1m",
  DIM: "\x1b[2m",
  RESET: "\x1b[0m",
} as const;

type Color = keyof typeof colors;


/** Regex compiled once at module load (not per-call). */
const ANSI_RE = /\x1b\[[0-9;]*m/g;

/** Returns the printable (visible) length of a string, ignoring ANSI escapes. */
export function visibleLength(text: string): number {
  return text.replace(ANSI_RE, "").length;
}

/** Strips all ANSI escape codes from a string. */
export function stripAnsi(text: string): string {
  return text.replace(ANSI_RE, "");
}

/** Wraps a colour code around text and resets afterwards. */
export function paint(color: Color, text: string): string {
  return `${colors[color]}${text}${colors.RESET}`;
}

/** Centers a pre-coloured line inside a fixed character width, padding with spaces. */
function centerInWidth(line: string, width: number): string {
  const len = visibleLength(line);
  const left = Math.max(0, Math.floor((width - len) / 2));
  const right = Math.max(0, width - len - left);
  return " ".repeat(left) + line + " ".repeat(right);
}

// ─── URL ─────────────────────────────────────────────────────────────────────

const DEFAULT_URL = process.env.BASE_URL ?? "rajeevpuri.com.np";

// ─── ASCII Banner ─────────────────────────────────────────────────────────────

/** Each row of the banner as [color, text] pairs so colours are data, not duplication. */
const BANNER_ROWS: Array<[Color, string]> = [
  [
    "YELLOW",
    "███████╗  ███████╗            ██╗  ███████╗  ███████╗  ███████╗  ██╗   ██╗",
  ],
  [
    "YELLOW",
    "██╔══██╗  ██╔══██╗            ██║  ██╔════╝  ██╔════╝  ██╔════╝  ██║   ██║",
  ],
  [
    "PURPLE",
    "██████╔╝  ███████║            ██║  █████╗    █████╗    █████╗    ██║   ██║",
  ],
  [
    "PURPLE",
    "██╔══██╗  ██╔══██║       ██   ██║  ██╔══╝    ██╔══╝    ██╔══╝    ╚██╗ ██╔╝",
  ],
  [
    "CYAN",
    "██║  ██║  ██║  ██║       ╚█████╔╝  ███████╗  ███████╗  ███████╗   ╚████╔╝",
  ],
  [
    "CYAN",
    "╚═╝  ╚═╝  ╚═╝  ╚═╝        ╚════╝   ╚══════╝  ╚══════╝  ╚══════╝    ╚═══╝",
  ],
];

// ─── Components ──────────────────────────────────────────────────────────────

/** Horizontal rule. */
export function Separator(width = 100): string {
  return `  ${colors.DARK_GRAY}${"─".repeat(width)}${colors.RESET}`;
}

export function Header(title: string, number: string, desc: string): string {
  const BOX_WIDTH = 100;
  const border = "═".repeat(BOX_WIDTH);
  const bb = colors.BRIGHT_BLUE;
  const R = colors.RESET;

  /** Wraps a line in box borders, centred within BOX_WIDTH. */
  const boxLine = (line: string): string =>
    `  ${bb}║${R}${centerInWidth(line, BOX_WIDTH)}${bb}║${R}`;

  const emptyRow = `  ${bb}║${R}${" ".repeat(BOX_WIDTH)}${bb}║${R}`;
  const divider = Separator();

  const bannerLines = BANNER_ROWS.map(([color, text]) =>
    boxLine(paint(color, text)),
  ).join("\n");

  const tagline = paint(
    "CYAN",
    "IBM Z Student Ambassador | Software Engineer | Linux Enthusiast",
  );
  const links = `${paint("CYAN", "rajeevpuri.com.np")} ${paint("PURPLE", "|")} ${paint("CYAN", "github.com/razeevascx")}`;
  const source = `${paint("CYAN", "Source:")} ${paint("CYAN", "github.com/razeevascx/portfolio")}`;

  const sectionTitle =
    `${paint("ORANGE", number)} ${paint("DARK_GRAY", "❯")} ` +
    `${colors.BOLD}${paint("WHITE", title.toUpperCase())}${colors.BOLD} ` +
    `${paint("DARK_GRAY", ":")} ${paint("GRAY", desc)}`;

  return [
    "",
    `  ${bb}╔${border}╗${R}`,
    emptyRow,
    bannerLines,
    emptyRow,
    boxLine(tagline),
    emptyRow,
    boxLine(links),
    emptyRow,
    boxLine(source),
    emptyRow,
    `  ${bb}╚${border}╝${R}`,
    "",
    divider,
    `    ${sectionTitle}`,
    divider,
    "",
  ].join("\n");
}

/**
 * A bordered box wrapping multi-line content.
 *
 * @param content Text to display (may include ANSI codes).
 * @param width   Total character width of the box including borders.
 */
export function Box(content: string, width = 70): string {
  const INNER = width - 4; // 2 borders + 2 padding spaces
  const lc = colors.LIGHT_CYAN;
  const R = colors.RESET;

  const top = `${lc}╔${"═".repeat(width - 2)}╗${R}`;
  const bottom = `${lc}╚${"═".repeat(width - 2)}╝${R}`;

  const rows = content.split("\n").map((line) => {
    const pad = Math.max(0, INNER - visibleLength(line));
    return `${lc}║${R} ${line}${" ".repeat(pad)} ${lc}║${R}`;
  });

  return [top, ...rows, bottom].join("\n");
}

/**
 * Word-wraps plain or ANSI-coloured text to a given width.
 *
 * Note: wrapping is calculated on visible (stripped) length, so ANSI codes
 * do not throw off the column count.
 *
 * @param text   The text to wrap (ANSI codes allowed but not counted).
 * @param width  Maximum visible characters per line.
 * @param indent String prepended to every line (e.g. "    " for indentation).
 */
export function wrapText(text: string, width: number, indent = ""): string {
  const effectiveWidth = Math.max(10, width - visibleLength(indent));
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  let currentLen = 0;

  for (const word of words) {
    const wordLen = visibleLength(word);
    const spacer = current ? 1 : 0;

    if (currentLen + spacer + wordLen > effectiveWidth && current) {
      lines.push(current);
      current = word;
      currentLen = wordLen;
    } else {
      current += (current ? " " : "") + word;
      currentLen += spacer + wordLen;
    }
  }

  if (current) lines.push(current);
  return lines.map((l) => indent + l).join("\n");
}

// ─── Request Detection ────────────────────────────────────────────────────────

const LLM_AGENTS = [
  "gptbot",
  "chatgpt-user",
  "claudebot",
  "googlebot",
  "bingbot",
  "anthropic-ai",
  "claude-web",
  "perplexitybot",
  "youbot",
] as const;

export function isCurlRequest(userAgent: string | null | undefined): boolean {
  return String(userAgent ?? "")
    .toLowerCase()
    .includes("curl");
}

export function isLLMRequest(userAgent: string | null | undefined): boolean {
  const agent = String(userAgent ?? "").toLowerCase();
  return LLM_AGENTS.some((bot) => agent.includes(bot));
}

// ─── Response Helpers ─────────────────────────────────────────────────────────

export function CurlResponse(content: string): Response {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function Legend(baseUrl: string = DEFAULT_URL): string {
  const $ = `  ${paint("YELLOW", "$")} curl`;
  return [
    `  ${paint("CYAN", "Legend")}`,
    "",
    `${$} ${baseUrl}            Full site summary (AI Optimized)`,
    `${$} ${baseUrl}/about      Get about information`,
    `${$} ${baseUrl}/projects   Get the list of projects`,
    `${$} ${baseUrl}/blog       Get the latest articles`,
    `${$} ${baseUrl}/services   Get available services`,
    `${$} ${baseUrl}/contact    Get contact information`,
  ].join("\n");
}
