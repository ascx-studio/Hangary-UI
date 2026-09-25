import type { ComponentProps } from 'react'
import { cn } from 'cn'

export type SeparatorProps = Omit<ComponentProps<'div'>, 'role' | 'aria-orientation' | 'aria-hidden'> & {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) {
  return (
    <div
      {...props}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    />
  )
}
