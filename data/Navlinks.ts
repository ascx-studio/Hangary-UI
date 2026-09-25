import { GitHubDark } from '@ridemountainpig/svgl-react'
import { Heart } from 'lucide-react';

const sections = {
	Logo: {
		label: 'Browse',
		links: [
			{ label: 'Components', href: '/components', external: false, icon: 'component' },
			{ label: 'Blocks', href: '/blocks', external: false, icon: 'template' },
			{ label: 'Templates', href: '/templates', external: false, icon: 'template' },
			{ label: 'Backgrounds', href: '/shader', external: false, icon: 'shader' },
			{ label: 'Utility Code', href: '/utils', external: false, icon: 'utility' },
		],
	},
} as const

export const navSections = [
	{
		label: 'General',
		links: [
			{ label: 'Support', href: '/sponser', external: false, icon: Heart },
			{ label: 'GitHub', href: 'https://github.com/razeevascx/lazy-ui', external: true, icon: GitHubDark },
		],
	},
	...Object.values(sections),
] as const

export const navLinks = navSections.flatMap(({ links, ...section }) => [
	{ ...section, external: false, icon: undefined },
	...links,
])
