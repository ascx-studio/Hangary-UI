import {
  ReactLight,
  Docker,
  Python,
  TailwindCSS,
  TypeScript,
  Nextjs,
  Vite,
  Nodejs,
  Figma,
  Firebase,
  ExpressjsDark,
  MongoDBDark,
  MySQLDark,
  Supabase,
  Spring,
  FramerDark,
  Git,
  Postman,
  Java,
  BashDark,
  C,
  GoDark,
  AmazonWebServicesDark,
  ShadcnUiDark,
  PrismaDark,
  Bun,
  GoogleAnalytics,
  Meta,
  PostHog,
  GoogleCloud,
  VercelDark,
  GraphQL,
  Redux,
  Zod,
  Redis,
  PostgreSQL,
  ESLintDark,
  PrettierDark,
  GitHubDark,
  Cloudflare,
  Kubernetes,
  ClerkLight,
  Stripe,
  Notion,
  XDark,
  Pinterest,
  ModelContextProtocolDark,
  Shopify,
  ElysiaJS,
  TurborepoDark,
  TanStack,
  ResendDark,
  OpenClaw,
  ApacheKafkaDark,
} from "@ridemountainpig/svgl-react";

export interface Skill {
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface Language {
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const language: Language[] = [
  {
    label: "TypeScript",
    icon: <TypeScript className="size-10" />,
    description:
      "TypeScript is a strongly typed programming language that builds on JavaScript.",
  },
  {
    label: "Java",
    icon: <Java className="size-10" />,
    description:
      "Java is a high-level, class-based, object-oriented programming language.",
  },
  {
    label: "Bash",
    icon: <BashDark className="size-10" />,
    description:
      "Bash is a Unix shell and command language that is widely used in Linux and macOS.",
  },
  {
    label: "Python",
    icon: <Python className="size-10" />,
    description:
      "Python is a high-level, interpreted programming language with dynamic semantics.",
  },
  {
    label: "C",
    icon: <C className="size-10" />,
    description:
      "C is a general-purpose programming language created as an extension of the B programming language.",
  },
  {
    label: "Go",
    icon: <GoDark className="size-10" />,
    description:
      "Go is a statically typed, compiled language designed at Google for simplicity and performance.",
  },
];

export const frameworksAndTools: Skill[] = [
  {
    label: "Next JS",
    icon: <Nextjs className="size-10" />,
    description:
      "The React Framework for production with built-in SSR and static generation.",
  },
  {
    label: "Spring Boot",
    icon: <Spring className="size-10" />,
    description:
      "Java-based framework for building production-grade stand-alone Spring applications.",
  },
  {
    label: "GraphQL",
    icon: <GraphQL className="size-10" />,
    description:
      "A query language for APIs that lets clients request exactly the data they need.",
  },
  {
    label: "Elysia JS",
    icon: <ElysiaJS className="size-10" />,
    description:
      "A modern JavaScript framework for building scalable web applications.",
  },
  {
    label:"TurboRepo",
    icon:<TurborepoDark className="size-10" />,
    description:"A high-performance build system for JavaScript and TypeScript monorepos.",
  },
  {
    label:"TanStack",
    icon:<TanStack className="size-10" />,
    description:"A set of open-source tools for building modern web applications.",
  },

  {
    label: "TailwindCSS",
    icon: <TailwindCSS className="size-10" />,
    description:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
  },

  {
    label: "Shadcn UI",
    icon: <ShadcnUiDark className="size-10" />,
    description:
      "Simple, accessible component library that helps you build apps faster.",
  },
  {
    label: "OpenClaw",
    icon: <OpenClaw className="size-10" />,
    description:
      "A production-ready motion library for React with declarative animations.",
  },
  {
    label: "MongoDB",
    icon: <MongoDBDark className="size-10" />,
    description:
      "A NoSQL document database with scalable, flexible data storage.",
  },
  {
    label:"Kafka",
    icon:<ApacheKafkaDark className="size-10" />,
    description:"A distributed event streaming platform for high-performance data pipelines.",
  },
  {
    label: "PostgreSQL",
    icon: <PostgreSQL className="size-10" />,
    description:
      "A powerful, open-source object-relational database system known for reliability.",
  },
  {
    label: "Redis",
    icon: <Redis className="size-10" />,
    description:
      "An in-memory data store used as a database, cache, and message broker.",
  },
  {
    label: "Supabase",
    icon: <Supabase className="size-10" />,
    description:
      "Open source Firebase alternative with PostgreSQL, Auth, and Real-time features.",
  },
  {
    label: "MCP",
    icon: <ModelContextProtocolDark className="size-10" />,
    description:
      "Model Context Protocol — an open standard for connecting AI models to external tools and data sources.",
  },
  {
    label: "Bun",
    icon: <Bun className="size-10" />,
    description:
      "The package manager for JavaScript and the world's largest software registry.",
  },
  {
    label: "Clerk",
    icon: <ClerkLight className="size-10" />,
    description:
      "A complete user management and authentication platform for React and Next.js apps.",
  },
  {
    label: "Stripe",
    icon: <Stripe className="size-10" />,
    description:
      "A payments platform for accepting and managing online transactions.",
  },
  {
    label: "Resend",
    icon: <ResendDark className="size-10" />,
    description:
      "A connected workspace for notes, docs, and databases — used here to power project and blog content.",
  },
  {
    label: "Figma",
    icon: <Figma className="size-10" />,
    description:
      "A web-based UI/UX design tool for collaborative interface design.",
  },
  {
    label: "Docker",
    icon: <Docker className="size-10" />,
    description:
      "A platform for developing, shipping, and running applications in containers.",
  },

  {
    label: "Kubernetes",
    icon: <Kubernetes className="size-10" />,
    description:
      "An open-source system for automating deployment, scaling, and management of containerized applications.",
  },
  {
    label: "PostHog",
    icon: <PostHog className="size-10" />,
    description:
      "A product analytics platform for tracking user behavior, feature flags, and session replay.",
  },
  {
    label: "Shopify",
    icon: <Shopify className="size-10" />,
    description:
      "A cloud-based e-commerce platform for creating online stores and managing sales.",
  },
];

export const clouds: Skill[] = [
  {
    label: "AWS",
    icon: <AmazonWebServicesDark className="size-10" />,
    description:
      "Amazon Web Services - a comprehensive, evolving cloud computing platform.",
  },

  {
    label: "Google Cloud",
    icon: <GoogleCloud className="size-10" />,
    description:
      "Google Cloud Platform - a suite of cloud computing services that runs on the same infrastructure that Google uses internally.",
  },
  {
    label: "Vercel",
    icon: <VercelDark className="size-10" />,
    description:
      "Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow.",
  },

  {
    label: "Cloudflare",
    icon: <Cloudflare className="size-10" />,
    description:
      "A global network providing CDN, security, and edge compute services.",
  },
];

export const marketingAndAds: Skill[] = [
  {
    label: "Meta Ads",
    icon: <Meta className="size-10" />,
    description:
      "Paid target-oriented visual advertising platform running across Facebook and Instagram feeds.",
  },
  {
    label: "Google Analytics",
    icon: <GoogleAnalytics className="size-10" />,
    description:
      "Comprehensive reporting application providing deep analytical search engine metric tracking.",
  },
  {
    label: "X Ads",
    icon: <XDark className="size-10" />,
    description:
      "Paid advertising platform on X (formerly Twitter) for promoted posts, trends, and follower campaigns.",
  },
  {
    label: "Pinterest Ads",
    icon: <Pinterest className="size-10" />,
    description:
      "Paid advertising platform on Pinterest for promoted pins and campaigns.",
  },
];
