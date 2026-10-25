export const samplePageLinks = [
  { label: "Home", href: "#home" },
  { label: "Components", href: "#components" },
  { label: "Blocks", href: "#blocks" },
  { label: "Shaders", href: "#shaders" },
  { label: "Sponsor", href: "#sponsor" },
  { label: "Privacy", href: "#privacy" },
];

export const sampleFooterGroups = [
  { title: "Pages", links: samplePageLinks.slice(0, 3) },
  { title: "More", links: samplePageLinks.slice(3) },
];

export const sampleMainFooterGroups = [
  { title: "Pages", links: samplePageLinks },
  { title: "Ask AI", links: [
    { label: "Gemini", href: "#gemini" },
    { label: "Claude", href: "#claude" },
    { label: "ChatGPT", href: "#chatgpt" },
    { label: "Perplexity", href: "#perplexity" },
    { label: "Grok", href: "#grok" },
  ] },
  { title: "Connect", links: [
    { label: "X", href: "#x" },
    { label: "GitHub", href: "#github" },
    { label: "Sponsor", href: "#sponsor" },
    { label: "Support the project", href: "#support" },
  ] },
];
