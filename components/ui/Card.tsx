import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type CardProps = Readonly<HTMLAttributes<HTMLElement>>

export default function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        'block border-2 border-base-300 bg-neutral text-neutral-content shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
