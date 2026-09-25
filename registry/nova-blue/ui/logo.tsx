import Image, { type ImageProps } from 'next/image'

export type LogoVariant = 'logo' | 'wordmark'

const logoVariants: Record<LogoVariant, Pick<ImageProps, 'src' | 'alt' | 'width' | 'height'>> = {
  logo: {
    src: '/logo.png',
    alt: 'Logo',
    width: 40,
    height: 40,
  },
  wordmark: {
    src: '/wordmark.png',
    alt: 'Wordmark',
    width: 160,
    height: 40,
  },
}

export type LogoProps = Readonly<{
  variant?: LogoVariant
}> &
  Pick<ImageProps, 'className' | 'priority' | 'sizes'>

export function Logo({ variant = 'wordmark', ...imageProps }: LogoProps) {
  const logo = logoVariants[variant]

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      {...imageProps}
    />
  )
}

export default Logo
