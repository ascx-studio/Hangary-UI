import * as motion from "motion/react-client";
import { socialLinks } from "../../lib/portfolio/constants";
import { cn } from "../../lib/portfolio/utils";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  hoverColor?: string;
  bgColor?: string;
  description?: string;
  username?: string;
}

interface SocialiconProps {
  size?: "sm" | "md" | "lg";
  gap?: string;
  className?: string;
  links?: SocialLink[];
  showLabel?: boolean;
  showUsername?: boolean;
}

function Socialicons({
  size = "md",
  gap = "gap-4",
  links,
  className,
  showUsername = false,
  showLabel = false,
}: Readonly<SocialiconProps>) {
  const renderLinks = links || socialLinks;
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn(`flex ${gap} ${className}`)}>
      {renderLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 ${sizeClasses[size]} text-gray-400 hover:text-white transition-colors duration-300 `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={showUsername && link.username ? `${link.name}: ${link.username}` : link.name}
        >
          {link.icon}
          {showLabel && link.name && (
            <span className="text-sm font-bold">{link.name}</span>
          )}
          {showUsername && link.username && (
            <span className="text-xs font-bold">{link.username}</span>
          )}
        </motion.a>
      ))}
    </div>
  );
}

export default Socialicons;
