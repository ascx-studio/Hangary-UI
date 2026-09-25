import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'

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
  primary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 ",
  secondary: " border border-slate-700 border-1",
  ghost: "text-slate-700 hover:bg-slate-100",
  link: "h-auto p-0 text-slate-900 underline-offset-4 hover:underline",
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
          "inline-flex items-center justify-center text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 px-4 py-2 focus-visible:outline-slate-900",
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
				'inline-flex items-center justify-center  px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:pointer-events-none disabled:opacity-50',
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
