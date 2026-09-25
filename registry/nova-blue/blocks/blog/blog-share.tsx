'use client';

import { Share2 } from 'lucide-react';
import { IconXTwitter, IconLinkedin } from 'nucleo-social-media';
import * as motion from 'motion/react-client';
import { toast } from 'react-hot-toast';

interface BlogShareProps {
  title: string;
  slug: string;
}

export function BlogShare({ title, slug }: BlogShareProps) {
  const url = `https://rajeevpuri.com.np/blog/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this blog post: ${title}`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid #27272a',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
        },
      });
    }
  };

  const socialShares = [
    {
      name: 'X',
      icon: <IconXTwitter className="size-3.5" />,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: <IconLinkedin className="size-3.5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2 ml-4 pl-4 ">
      {socialShares.map((social) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5  text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/30"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          title={`Share on ${social.name}`}
        >
          {social.icon}
        </motion.a>
      ))}
      <motion.button
        onClick={handleShare}
        className="p-1.5 rounded-sm bg-primary/5 text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/30"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.95 }}
        title="Share"
      >
        <Share2 className="size-3.5" />
      </motion.button>
    </div>
  );
}
