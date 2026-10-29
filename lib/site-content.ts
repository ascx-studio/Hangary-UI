export const contactEmail = "ui@razzev.com";

export const homeOverview = [
  {
    title: "Components you can make your own",
    text: "Hangry UI is a free collection of React components, page blocks, and animated backgrounds. Explore buttons, cards, tabs, tooltips, navigation, login forms, pricing sections, and footers. Each documentation page includes a live preview, setup instructions, and source code so you can understand the implementation before adding it to your project.",
    href: "/components",
    label: "Browse components",
  },
  {
    title: "From a preview to your project",
    text: "Install individual components with the shadcn CLI, or copy the documented source and adapt it to your interface. The collection uses Tailwind CSS for styling and Motion for animation. Check each example for its dependencies, props, and reduced-motion behavior. The source lives in your project, giving you control over the design and behavior.",
    href: "/blocks",
    label: "Explore page blocks",
  },
  {
    title: "Motion with room to experiment",
    text: "Use vgpu React shaders for interactive WebGPU water, light rays, gradients, and other background effects. CSS and SVG backgrounds are available too. Combine those examples with reusable interface components to build landing pages, dashboards, and product screens. Report bugs or suggest improvements on GitHub. Sponsorship is optional and helps support maintenance and new examples.",
    href: "/shader",
    label: "Discover shaders",
  },
];

export const informationPages = {
  privacy: {
    title: "Privacy at Hangry UI",
    description:
      "How this documentation site uses browser storage, analytics, session replay, and external services.",
    sections: [
      {
        title: "Browsing the documentation",
        text: "Hangry UI is a public documentation and preview site. You can browse its components, blocks, and shaders without creating a Hangry UI account. Your browser makes requests to the site and its hosting infrastructure to load pages, fonts, images, and scripts. Those requests expose technical information such as the requested URL, IP address, and browser headers to the infrastructure serving them. This notice describes the site's implementation; third-party services have separate privacy policies.",
      },
      {
        title: "Analytics and session replay",
        text: "When analytics is configured, the site uses PostHog for page views, interface interactions, errors, performance measurements, and session replay. The current implementation initializes analytics unless a rejection is stored. Choosing Reject analytics opts out of subsequent client-side capture. Choosing Accept analytics enables it, and dismissing the analytics notice currently records acceptance. Replay masks input fields, blocks hidden and file inputs, and masks elements marked as sensitive. Request headers, request bodies, and console-log recording are disabled in replay configuration. Do not enter confidential information into public component demos.",
      },
      {
        title: "Browser storage and preferences",
        text: "The site stores the analytics choice in local storage under hangry-ui-analytics-consent and remembers the documentation sidebar preference in local storage. PostHog may also use browser persistence when enabled. You can remove these stored values through your browser's site-data settings; clearing them resets the saved choice and may display the analytics notice again. A rejection applies to client-side analytics and does not disable ordinary hosting requests or server-side operational logging.",
      },
      {
        title: "External links and project contact",
        text: `GitHub, X, sponsorship, and Ask AI links take you to external services. Ask AI links include a prepared question about the public Hangry UI website in the destination URL; using those links shares that question with the selected service. Review that service's privacy practices before using it. Messages you send through email or public GitHub issues are handled by those providers. For questions about this site or a privacy concern, contact ${contactEmail}. Avoid including sensitive personal data in public issues.`,
      },
    ],
    links: [
      { label: "Contact the project", href: `mailto:${contactEmail}` },
      {
        label: "Review analytics source",
        href: "https://github.com/ascx-studio/ui/blob/main/lib/analytics-consent.ts",
      },
      { label: "PostHog privacy policy", href: "https://posthog.com/privacy" },
    ],
  },
};
