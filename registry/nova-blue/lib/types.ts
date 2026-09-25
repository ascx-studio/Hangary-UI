export interface QuickLink {
  id: string;
  title: string;
  url: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  hoverColor: string;
  bgColor: string;
  description: string;
  username?: string;
}

export interface Education {
  degree: string;
  school: string;
  logo: string;
  location: string;
  year: string;
  experiences: string[];
  link: string;
}

export interface TechStack {
  [key: string]: {
    id: string;
    icon: React.ReactNode;
  };
}

export interface Project {
  title: string;
  description: string;
  link: string;
  liveLink?: string;
  tech: TechStack;
  featured?: boolean;
  stars?: number;
  forks?: number;
  list?: string[];
}

export interface Service {
  id: string;
  icon: React.ReactNode;
  illustration?: React.ComponentType | React.ReactNode;
  category: string;
  type: "core" | "capable";
  title: string;
  description: string;
  technologies: string[];
}
