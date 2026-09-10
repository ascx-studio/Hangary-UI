import {cn} from '@/utils/cn';

export default function Cointainer({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <section className={cn(className, "max-w-6xl mx-auto overflow-x-hidden")}>
      {children}
    </section>
  );
}
