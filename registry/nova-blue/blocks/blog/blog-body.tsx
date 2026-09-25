interface BlogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function BlogBody({ children, className = '' }: BlogBodyProps) {
  return (
    <p
      className={`
         md:text-xl mb-6  leading-7 not-first:mt-6  text-foreground/90  text-sm/4 tracking-tight text-justify
        ${className}
      `}
    >
      {children}
    </p>
  );
}
