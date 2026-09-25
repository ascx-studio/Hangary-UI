import type { ComponentProps } from 'react'
import { cn } from 'cn'

export type AlertProps = ComponentProps<'div'> & {
  variant?: 'default' | 'destructive'
}

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      {...props}
      className={cn(
        'w-full border p-4',
        variant === 'destructive'
          ? 'border-destructive text-destructive'
          : 'border-border bg-card text-card-foreground',
        className,
      )}
    />
  )
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn('mb-1 font-medium', className)} />
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn('text-sm leading-6', className)} />
}
