import {
  ReactLight,
  Nodejs,
  Python,
  Docker,
  Redux,
  TailwindCSS,
  MotionDark,
  Vite,
  Java,
  TypeScript,
  Nextjs,
  Supabase,
  Vue,
  MongoDBDark,
} from "@ridemountainpig/svgl-react";
import {
  Mail,

  Code,
  Palette,
  Database,
  PaletteIcon,
  Layers,
  Infinity,
  Search,
  Pencil,
  LayoutDashboard,
  Rocket,
} from "lucide-react";
import {
  ArchitectureIllustration,
  BrandingIllustration,
  DatabaseIllustration,
  DevOpsIllustration,
  FullStackIllustration,
  UIUXIllustration,
} from "../components/illustration/service-illustrations";
import { IconXTwitter, IconGithub, IconLinkedin } from "nucleo-social-media";





interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  hoverColor: string;
  bgColor: string;
  description: string;
  username?: string;
}



export interface Service {
  id: string;
  icon: React.ReactNode;
  illustration?: React.ComponentType | React.ReactNode;
  category: string;
  type: "core" | "capable";
  title: string;
  description: string;
  gridClass: string;
  technologies: string[];
}

export interface Project {
  title: string;
  description: string;
  link: string;
  liveLink?: string;
  tech: Record<string, { id: string; icon: React.ReactNode | null }>;
  featured?: boolean;
  stars?: number;
  forks?: number;
}

export const socialLinks: SocialLink[] = [
  {
    name: "X (Formerly Twitter)",
    url: "https://x.com/razeev_asnx",
    icon: <IconXTwitter className="w-6 h-6" />,
    hoverColor: "hover:text-white",
    bgColor: "bg-white/10",
    description: "Latest updates & thoughts",
    username: "@razeev_asnx",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/razeevasnx",
    icon: <IconLinkedin className="w-6 h-6" />,
    hoverColor: "hover:text-blue-600",
    bgColor: "bg-blue-600/10",
    description: "Professional network",
    username: "Rajeev Puri",
  },
  {
    name: "GitHub",
    url: "https://github.com/razeevascx/",
    icon: <IconGithub size={30} />,
    hoverColor: "hover:text-white",
    bgColor: "bg-white/10",
    description: "Check out my projects",
    username: "razeevascx",
  },
  {
    name: "Mail",
    url: "mailto:contact@rajeevpuri.com.np",
    icon: <Mail size={30} />,
    hoverColor: "hover:text-blue-400",
    bgColor: "bg-blue-400/10",
    description: "Mail service",
    username: "contact@rajeevpuri.com.np",
  },
];

export const services = [
  {
    id: "01",
    icon: <PaletteIcon />,
    illustration: <BrandingIllustration />,
    title: "Brand Strategy & Digital Identity Systems",

    gridClass: "md:col-span-2 md:row-span-1",
    technologies: [
      "Brand Architecture",
      "Figma",
      "Design Systems",
      "Typography",
    ],
    category: "Digital Branding",
    type: "capable",
  },
  {
    id: "02",
    icon: <Code />,
    illustration: <FullStackIllustration />,
    title: "Scalable Next.js & Full-Stack Development",

    technologies: [
      "TypeScript",
      "PostgreSQL",
      "Performance Optimization",
      "Tailwind CSS",
    ],
    category: "Software Engineering",
    type: "core",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "03",
    icon: <Palette />,
    illustration: <UIUXIllustration />,
    title: "Conversion-Focused UI/UX & Product Design",

    technologies: ["Figma", "Wireframing", "User Testing", "Framer Motion"],
    category: "UX/UI Design",
    type: "core",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "04",
    icon: <Database />,
    illustration: <DatabaseIllustration />,
    title: "Database Architecture & Query Optimization",

    technologies: [
      "Redis",
      "Prisma ORM",
      "Indexing Strategies",
      "Data Modeling",
    ],
    category: "Backend & Data",
    type: "core",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "05",
    icon: <Layers />,
    illustration: <ArchitectureIllustration />,
    title: "Enterprise System Design & Architecture",

    technologies: [
      "Microservices",
      "Serverless Architecture",
      "REST & GraphQL",
      "Load Balancing",
    ],
    category: "Systems Architecture",
    type: "core",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "06",
    icon: <Infinity />,
    illustration: <DevOpsIllustration />,
    title: "Cloud DevOps & Infrastructure Security",

    technologies: ["AWS/Vercel", "Docker", "Kubernetes", "GitHub Actions"],
    category: "DevOps & Cloud",
    type: "capable",
    gridClass: "md:col-span-2 md:row-span-1",
  },
];

export const processSteps = [

    {
      step: "01",
      // SEO Tip: Focus on "Product Roadmap" and "Digital Strategy"
      title: "Product Discovery & Digital Strategy",
      detail:
        "I analyze your business goals and user personas to define a technical roadmap. We focus on market research and competitive analysis to ensure a high-ROI product launch.",
      icon: Search,
      status: "Strategy Phase",
    },
    {
      step: "02",
      // SEO Tip: Use "UX/UI" and "Prototyping" for design-intent searches
      title: "UX/UI Design & Interactive Prototyping",
      detail:
        "I craft conversion-focused user interfaces and scalable design systems. Using high-fidelity prototypes, we validate user experience (UX) before a single line of code is written.",
      icon: Pencil,
      status: "Design Phase",
    },
    {
      step: "03",
      // SEO Tip: Mention "Full-Stack" and "Scalable"
      title: "Full-Stack Engineering & Clean Code",
      detail:
        "Building robust, scalable architectures using modern tech stacks like Next.js and Node.js. I ensure pixel-perfect frontend implementation and high-performance backend systems.",
      icon: LayoutDashboard,
      status: "Development Phase",
    },
    {
      step: "04",
      // SEO Tip: Focus on "Deployment" and "Optimization"
      title: "Strategic Launch & Performance Scaling",
      detail:
        "I handle secure cloud deployment and real-world performance monitoring. Post-launch, I provide ongoing support to optimize speed, SEO, and user engagement metrics.",
      icon: Rocket,
      status: "Launch Phase",
    },

];

export const projectList = [
  {
    title: "Portfolio",
    description:
      "Portfolio website to showcase my ideas - A modern, responsive personal portfolio built with Next.js, featuring smooth animations and professional design.",
    link: "https://github.com/razeevascx/Portfolio",
    liveLink: "https://rajeevpuri.com.np",
    tech: {
      nextjs: {
        id: "Next.js",
        icon: (
          <Nextjs
            width={24}
            height={24}
            className="text-[#000000] dark:text-white"
          />
        ),
      },
      react: {
        id: "React",
        icon: <ReactLight width={24} height={24} className="text-[#61DAFB]" />,
      },
      tailwind: {
        id: "Tailwind CSS",
        icon: <TailwindCSS width={24} height={24} className="text-[#06B6D4]" />,
      },
      typescript: {
        id: "TypeScript",
        icon: <TypeScript width={24} height={24} className="text-[#3178C6]" />,
      },
      framer: {
        id: "Framer Motion",
        icon: <MotionDark width={24} height={24} className="text-[#0055FF]" />,
      },
    },
    featured: true,
  },
  {
    title: "TeraBox Bot",
    description:
      "Telegram bot for TeraBox automation - An advanced bot with 2 stars and 3 forks, featuring file management and download assistance.",
    link: "https://github.com/razeevascx/terabox_bot",
    tech: {
      python: {
        id: "Python",
        icon: <Python width={24} height={24} className="text-[#3776AB]" />,
      },
      docker: {
        id: "Docker",
        icon: <Docker width={24} height={24} className="text-[#2496ED]" />,
      },
    },
    featured: true,
    stars: 2,
    forks: 3,
  },
  {
    title: "MailRef",
    description:
      "A temporary email service built with Next.js and Supabase, allowing users to generate disposable email addresses for privacy protection.",
    link: "https://github.com/razeevascx/MailRef",
    tech: {
      nextjs: {
        id: "Next.js",
        icon: (
          <Nextjs
            width={24}
            height={24}
            className="text-[#000000] dark:text-white"
          />
        ),
      },
      tailwind: {
        id: "Tailwind CSS",
        icon: <TailwindCSS width={24} height={24} className="text-[#06B6D4]" />,
      },
      typescript: {
        id: "TypeScript",
        icon: <TypeScript width={24} height={24} className="text-[#3178C6]" />,
      },
      supabase: {
        id: "Supabase",
        icon: <Supabase width={24} height={24} className="text-[#3ECF8E]" />,
      },
    },
  },
  {
    title: "Simple Bank Management System",
    description:
      "A banking system using Java - Comprehensive banking application with account management, transactions, and user authentication.",
    link: "https://github.com/razeevascx/Bank_Management_System",
    tech: {
      java: {
        id: "Java",
        icon: <Java width={24} height={24} className="text-[#ED8B00]" />,
      },
      database: {
        id: "Database",
        icon: <MongoDBDark width={24} height={24} className="text-[#4DB33D]" />,
      },
    },
  },
  {
    title: "News Template",
    description:
      "A modern, responsive news website template with clean design, article management, and optimized reading experience.",
    link: "https://github.com/razeevascx/news-temp",
    tech: {
      react: {
        id: "React",
        icon: <ReactLight width={24} height={24} className="text-[#61DAFB]" />,
      },
      tailwind: {
        id: "Tailwind CSS",
        icon: <TailwindCSS width={24} height={24} className="text-[#06B6D4]" />,
      },
      vite: {
        id: "Vite",
        icon: <Vite width={24} height={24} className="text-[#646CFF]" />,
      },
    },
  },
  {
    title: "School Management System",
    description:
      "A comprehensive system to manage school operations, including student enrollment, attendance tracking, and grade management.",
    link: "https://drive.google.com/file/d/17FeCxwSDwn6E1xAZLi-f313TcjAebRVw/view",
    tech: {
      react: {
        id: "React",
        icon: <ReactLight width={24} height={24} className="text-[#61DAFB]" />,
      },
      nodejs: {
        id: "Node.js",
        icon: <Nodejs width={24} height={24} className="text-[#339933]" />,
      },
      mongodb: {
        id: "MongoDB",
        icon: <MongoDBDark width={24} height={24} className="text-[#47A248]" />,
      },
      express: {
        id: "Express",
        icon: <Nodejs width={24} height={24} className="text-white" />,
      },
      redux: {
        id: "Redux",
        icon: <Redux width={24} height={24} className="text-[#764ABC]" />,
      },
    },
  },
  {
    title: "Qwizzed",
    description:
      "An interactive quiz application for testing knowledge with real-time scoring and detailed analytics. Built with modern TypeScript technologies.",
    link: "https://github.com/razeevascx/qwizzed",
    tech: {
      typescript: {
        id: "TypeScript",
        icon: <TypeScript width={24} height={24} className="text-[#3178C6]" />,
      },
      react: {
        id: "React",
        icon: <ReactLight width={24} height={24} className="text-[#61DAFB]" />,
      },
      tailwind: {
        id: "Tailwind CSS",
        icon: <TailwindCSS width={24} height={24} className="text-[#06B6D4]" />,
      },
    },
    stars: 1,
  },
  {
    title: "Z Xplore",
    description:
      "IBM Z Xplore Dev Container - Packages core tooling for IBM Z Xplore mainframe development without manual setup, enabling streamlined containerized development.",
    link: "https://github.com/razeevascx/z-xplore",
    tech: {
      docker: {
        id: "Docker",
        icon: <Docker width={24} height={24} className="text-[#2496ED]" />,
      },
    },
  },
  {
    title: "New Tab",
    description:
      "A beautiful and customizable new tab page extension. Provides an elegant dashboard with quick access to frequently used features and personalization options.",
    link: "https://github.com/razeevascx/new-tab",
    tech: {
      vue: {
        id: "Vue",
        icon: <Vue width={24} height={24} className="text-[#4FC08D]" />,
      },
    },
  },
  {
    title: "Passkey Demo",
    description:
      "A demonstration project showcasing passwordless authentication using passkeys. Implements modern security standards for user authentication.",
    link: "https://github.com/razeevascx/passkey-demo",
    tech: {
      typescript: {
        id: "TypeScript",
        icon: <TypeScript width={24} height={24} className="text-[#3178C6]" />,
      },
    },
  },
];
