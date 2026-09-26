
import {cn} from '@/utils/cn'
import type { ComponentProps } from 'react'


type CardProps = ComponentProps<'article'>

export default function Card({className, ...props}: CardProps) {
    return (
        <article
            className={cn(
                'block border-2 border-border bg-card text-card-foreground shadow-sm',
                className,
            )}
            {...props}
        />
    )
}
