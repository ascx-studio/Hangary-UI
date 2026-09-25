import { Children, isValidElement } from 'react';

interface BlogHeadingProps {
  level?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}

function getChildrenText(children: React.ReactNode): string {
  let text = '';
  Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    } else if (isValidElement<{ children?: React.ReactNode }>(child)) {
      text += getChildrenText(child.props.children);
    }
  });
  return text;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function BlogHeading({
  level = 'h2',
  children,
  className = '',
}: BlogHeadingProps) {
  const baseStyles = 'text-foreground font-geist scroll-m-20 mb-4 mt-8 first:mt-0 tracking-tight';

  const sizeStyles = {
    h1: "text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-extrabold text-balance ",
    h2: "text-3xl md:text-4xl lg:text-5xl border-b pb-2 font-semibold tracking-tight first:mt-0 leading-[0.95]",
    h3: "text-2xl md:text-3xl lg:text-4xl leading-[0.95] font-semibold tracking-tight",
  };

  const HeadingTag = level;
  const headingText = getChildrenText(children);
  const id = slugify(headingText);

  return (
    <HeadingTag id={id} className={`${baseStyles} ${sizeStyles[level]} ${className}`}>
      {children}
    </HeadingTag>
  );
}
