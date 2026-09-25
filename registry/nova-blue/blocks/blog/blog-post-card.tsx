import Link from "next/link";
import { formatDate } from "../../../lib/portfolio/utils";
import type { BlogPost } from "../../../lib/portfolio/notion/blog";

type BlogPostCardProps = {
  post: BlogPost;
  featured?: boolean;
  priority?: boolean;
};

export function BlogPostCard({ post, featured = false, priority = false }: Readonly<BlogPostCardProps>) {

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group h-full border group transition-colors duration-normal   hover:bg-white/2 p-6 border-border hover:border-primary/50"
    >
      <article className="flex flex-col h-full justify-between">
        <div
          className={`flex items-center gap-2 mb-6 border-b pb-4 border-zinc-900`}
        >
          <div className="flex gap-1.5 ">
            <div className="w-2 h-2 bg-primary"></div>
            <div className="w-2 h-2 bg-zinc-500"></div>
            <div className="w-2 h-2 bg-zinc-700"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex font-mono text-sm mr-auto items-center gap-4 text-foreground-muted mb-3 opacity-40 max-w-4xl">
            {post.publishedDate && (
              <time dateTime={post.publishedDate}>
                {formatDate(post.publishedDate)}
              </time>
            )}
            {post.readingTime > 0 && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
          <h3 className="text-3xl group-hover:text-primary font-bold text-foreground transition-colors duration-normal tracking-tight">
            {post.title}
          </h3>
          <p className="text-sm md:text-base text-foreground-secondary leading-relaxed group-hover:text-foreground transition-colors duration-normal mt-4 max-w-3xl font-light">
            {post.excerpt}
          </p>
        </div>

        <div className="  gap-4 pt-6 mt-2 border-t border-zinc-900/60">
          <div className="flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-zinc-900/60 text-zinc-400 group-hover:text-zinc-300 px-3 py-1 border border-zinc-800 group-hover:border-zinc-700/80 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 "
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
