import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utils/cn'

export type ButtonVariant =
	| 'primary'
	| 'base'
	| 'secondary'
	| 'accent'
	| 'neutral'
	| 'info'
	| 'success'
	| 'warning'
	| 'error'
	| 'ghost'
	| 'link'

type StandardButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
	children?: ReactNode
	type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
	variant?: Exclude<ButtonVariant, 'link'>
}

type LinkButtonProps = Omit<LinkProps, 'className' | 'children' | 'type'> & {
	className?: string
	children?: ReactNode
	href: LinkProps['href']
	type: 'link'
	variant?: ButtonVariant
}

export type ButtonProps = StandardButtonProps | LinkButtonProps

const variantStyles: Record<ButtonVariant, string> = {
	primary: 'border-2 border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
	base: 'border-2 border-border bg-background text-foreground shadow-sm hover:bg-muted',
	secondary: 'border-2 border-secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90',
	accent: 'border-2 border-accent bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
	neutral: 'border-2 border-border bg-card text-card-foreground shadow-sm hover:bg-card/90',
	info: 'border-2 border-info bg-info text-info-foreground shadow-sm hover:bg-info/90',
	success: 'border-2 border-success bg-success text-success-foreground shadow-sm hover:bg-success/90',
	warning: 'border-2 border-warning bg-warning text-warning-foreground shadow-sm hover:bg-warning/90',
	error: 'border-2 border-destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
	ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
	link: 'h-auto p-0 text-foreground underline-offset-4 hover:underline',
};

function isLinkButtonProps(props: ButtonProps): props is LinkButtonProps {
	return 'href' in props
}

export default function Button(props: ButtonProps) {
	if (isLinkButtonProps(props)) {
		const { children, className, variant = 'link', ...linkProps } = props

		return (
      <Link
        className={cn(
		  'inline-flex items-center justify-center text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 px-4 py-2 focus-visible:outline-ring',
          variantStyles[variant],
          className,
        )}
        {...linkProps}
      >
        {children}
      </Link>
    );
	}

	const { children, className, type = 'button', variant = 'primary', ...buttonProps } = props

	return (
		<button
			className={cn(
				'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50',
				variantStyles[variant],
				className,
			)}
			type={type}
			{...buttonProps}
		>
			{children}
		</button>
	)
}
