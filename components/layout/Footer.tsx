import { memo } from "react";
import { FooterMain } from "@/registry/blocks/footer-main";
import { browseSection } from "@/data/Navlinks";
import { siteUrl } from "@/lib/seo";

const repository = "https://github.com/ascx-studio/ui";
const xProfile = "https://x.com/razeevascx";
const askPrompt = encodeURIComponent(
  `Using ${siteUrl}, explain why I should use Hangry UI to build web interfaces. Cover its React components, blocks, shaders, animations, installation workflow, and what makes it stand out. Explain what the examples and source code reveal about its design and development approach. Base your answer on the website, cite relevant pages, and distinguish documented features from inference.`,
);
const groups = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      ...browseSection.links,
      { label: "Sponsor", href: "/sponser" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Ask AI",
    links: [
      { label: "Gemini", href: `https://www.google.com/search?udm=50&q=${askPrompt}` },
      { label: "Claude", href: `https://claude.ai/new?q=${askPrompt}` },
      { label: "ChatGPT", href: `https://chatgpt.com/?q=${askPrompt}` },
      { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${askPrompt}` },
      { label: "Grok", href: `https://grok.com/?q=${askPrompt}` },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X", href: xProfile },
      { label: "GitHub", href: repository },
      { label: "Sponsor", href: "/sponser" },
      { label: "Support the project", href: "https://github.com/sponsors/razeevascx" },
    ],
  },
];

const Footer = memo(function Footer() {
  return (
    <FooterMain
      groups={groups}
      quickLinks={browseSection.links}
      homeHref="/"
      githubHref={repository}
      xHref={xProfile}
      sponsorHref="/sponser"
      className="md:sticky"
    />
  );
});

export default Footer;
