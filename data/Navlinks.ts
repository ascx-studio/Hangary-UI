import { GitHubDark } from '@ridemountainpig/svgl-react'
import { Heart } from 'lucide-react';

const sections = {
	Logo: {
		label: 'logo',
		links: [
			{ label: 'Component', href: '/components', external: false, icon: 'component' },
			{ label: 'Templates', href: '/templates', external: false, icon: 'template' },
			{ label: 'Shader', href: '/shader', external: false, icon: 'shader' },
			{ label: 'Utility Code', href: '/utils', external: false, icon: 'utility' },
		],
	},
} as const

export const navSections = [
	{
		label: 'General',
		links: [
			{ label: 'Support', href: '/sponser', external: false, icon: Heart },
			{ label: 'GitHub', href: 'https://github.com', external: true, icon: GitHubDark },
		],
	},
	...Object.values(sections),
] as const

export const navLinks = navSections.flatMap(({ links, ...section }) => [
	{ ...section, external: false, icon: undefined },
	...links,
])
