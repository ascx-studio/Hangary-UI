import Image from 'next/image'

export const iconSources = {
  component: '/component.svg',
  template: '/template.svg',
  shader: '/shader.svg',
  utility: '/utility.svg',
} as const

export type IconName = keyof typeof iconSources

export type IconProps = Readonly<{
  name: IconName
  alt?: string
  size?: number
  className?: string
}>

export function Icon({
  name,
  alt = '',
  size = 24,
  className,
}: IconProps) {
  return (
    <Image
      src={iconSources[name]}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  )
}

export default Icon
