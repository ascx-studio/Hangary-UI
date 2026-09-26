'use client'

import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Badge from '@/registry/nova-blue/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/registry/nova-blue/ui/alert'
import { Separator } from '@/registry/nova-blue/ui/separator'
import Card from '@/registry/nova-blue/ui/card'
import Icon from '@/registry/nova-blue/ui/icon'
import Logo from '@/registry/nova-blue/ui/logo'
import Container from '@/registry/nova-blue/components/container'
import Footer from '@/registry/nova-blue/blocks/footer'
import * as Icons from '@/registry/nova-blue/components/icons'
import PortfolioLogo from '@/registry/nova-blue/components/logo'
import { Minimap } from '@/registry/nova-blue/components/minmap'
import MobileMenu from '@/registry/nova-blue/blocks/mobile-menu'
import Navbar from '@/registry/nova-blue/blocks/navbar'
import { NotFound } from '@/registry/nova-blue/blocks/not-found'
import SectionBlock from '@/registry/nova-blue/components/section-block'
import TerminalHeader from '@/registry/nova-blue/components/terminal-header'
import { VerifiedIcon } from '@/registry/nova-blue/components/verified-icon'
import LabelCards from '@/registry/nova-blue/blocks/label-cards'
import CertificateCard from '@/registry/nova-blue/components/cards/certificate-card'
import LanguageCard from '@/registry/nova-blue/components/cards/language-card'
import LocationCard from '@/registry/nova-blue/components/cards/location-card'
import ProjectCard from '@/registry/nova-blue/components/cards/project-card'
import ServiceCard from '@/registry/nova-blue/components/cards/service-card'
import SkillCard from '@/registry/nova-blue/components/cards/skill-card'
import * as Illustrations from '@/registry/nova-blue/components/illustration/service-illustrations'
import CopyCommand from '@/registry/nova-blue/ui/copy-command'
import Items from '@/registry/nova-blue/ui/items'
import Marquee from '@/registry/nova-blue/ui/marquee'
import SectionHeading from '@/registry/nova-blue/ui/section-heading'
import ShareButton from '@/registry/nova-blue/ui/share-button'
import * as Breadcrumb from '@/registry/nova-blue/ui/breadcrumb'
import { DotmSquare11 } from '@/registry/nova-blue/ui/dotm-square-11'
import { DotMatrixBase } from '@/registry/nova-blue/ui/dotmatrix-core'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/registry/nova-blue/ui/hover-card'

function MobileDemo() {
  const [open, setOpen] = useState(true)
  return <div className="relative min-h-96 w-full [&>div]:static [&>div]:block"><button onClick={() => setOpen(!open)} className="border p-3">{open ? 'Close menu' : 'Open menu'}</button>{open && <MobileMenu onClose={() => setOpen(false)} />}</div>
}

const headings = [{ id: 'demo-intro', text: 'Introduction', level: 2 }, { id: 'demo-details', text: 'Details', level: 3 }]
function Contents() {
  return <div className="grid w-full grid-cols-2 gap-8"><div><h2 id="demo-intro" className="mb-8 text-2xl">Introduction</h2><h3 id="demo-details">Details</h3></div><Minimap items={headings.map(h => ({ title: h.text, url: `#${h.id}`, depth: h.level }))} /></div>
}

// Keys are the entry paths in registry.json; demos supply only example props.
export const registryDemos = {
  'registry/nova-blue/ui/badge.tsx': () => <div className="flex items-center gap-3 text-4xl"><Badge /><span className="text-base">Verified</span></div>,
  'registry/nova-blue/ui/alert.tsx': () => <Alert><AlertTitle>Changes saved</AlertTitle><AlertDescription>Your settings are up to date.</AlertDescription></Alert>,
  'registry/nova-blue/ui/separator.tsx': () => <div className="w-full space-y-6"><p>Profile</p><Separator /><p>Settings</p></div>,
  'registry/nova-blue/ui/card.tsx': () => <Card className="p-8"><h3 className="text-xl">Project overview</h3><p className="mt-3">A reusable surface for related content.</p></Card>,
  'registry/nova-blue/ui/icon.tsx': () => <div className="flex gap-8"><Icon name="component" size={48} alt="Component" /><Icon name="shader" size={48} alt="Shader" /></div>,
  'registry/nova-blue/ui/logo.tsx': () => <Logo />,
  'registry/nova-blue/components/container.tsx': () => <Container className="w-full border border-dashed p-12">Content inside the portfolio container.</Container>,
  'registry/nova-blue/blocks/footer.tsx': () => <Footer />,
  'registry/nova-blue/components/icons.tsx': () => <div className="flex flex-wrap gap-6">{Object.entries(Icons).map(([name, Glyph]) => <div key={name}><Glyph /><p>{name}</p></div>)}</div>,
  'registry/nova-blue/components/logo.tsx': () => <PortfolioLogo width={160} height={60} />,
  'registry/nova-blue/components/minmap.tsx': () => <Contents />,
  'registry/nova-blue/blocks/mobile-menu.tsx': MobileDemo,
  'registry/nova-blue/blocks/navbar.tsx': () => <div className="w-full"><Navbar /></div>,
  'registry/nova-blue/blocks/not-found.tsx': () => <NotFound />,
  'registry/nova-blue/components/section-block.tsx': () => <SectionBlock title="Selected work" description="A collection of recent projects."><p className="mt-6">Your content goes here.</p></SectionBlock>,
  'registry/nova-blue/components/terminal-header.tsx': () => <TerminalHeader>portfolio.tsx</TerminalHeader>,
  'registry/nova-blue/components/verified-icon.tsx': () => <VerifiedIcon className="size-16 text-primary" />,
  'registry/nova-blue/blocks/label-cards.tsx': () => <div className="w-full"><LabelCards /></div>,
  'registry/nova-blue/components/cards/certificate-card.tsx': () => <CertificateCard item={{ id: 'sample', name: 'Frontend Development', issuer: { name: 'Sample Academy' }, issued_at: '2025-01-15' }} />,
  'registry/nova-blue/components/cards/language-card.tsx': () => <LanguageCard skill={{ label: 'TypeScript', icon: <Code2 /> }} />,
  'registry/nova-blue/components/cards/location-card.tsx': () => <LocationCard label="01" title="London" subtitle="Remote / Onsite" address={['London, UK']} status="Available" />,
  'registry/nova-blue/components/cards/project-card.tsx': () => <ProjectCard title="Studio journal" description="A place for ideas and experiments." link="https://example.com" image="/Sample.jpeg" tech={{ react: { id: 'React', icon: null } }} />,
  'registry/nova-blue/components/cards/service-card.tsx': () => <ServiceCard index={0} service={{ title: 'Web development', category: 'Engineering', description: 'Accessible, responsive experiences.', technologies: ['React', 'TypeScript'] }} />,
  'registry/nova-blue/components/cards/skill-card.tsx': () => <SkillCard skill={{ label: 'TypeScript', icon: <Code2 />, description: 'Typed JavaScript' }} />,
  'registry/nova-blue/components/illustration/service-illustrations.tsx': () => <div className="grid w-full gap-6 sm:grid-cols-2">{Object.entries(Illustrations).map(([name, Illustration]) => <div key={name}><Illustration /></div>)}</div>,
  'registry/nova-blue/ui/copy-command.tsx': () => <CopyCommand command="npm run dev" />,
  'registry/nova-blue/ui/items.tsx': () => <Items Number="01" title="Projects" des="A selection of recent work." />,
  'registry/nova-blue/ui/marquee.tsx': () => <div className="w-full overflow-hidden"><Marquee /></div>,
  'registry/nova-blue/ui/section-heading.tsx': () => <SectionHeading>Selected work</SectionHeading>,
  'registry/nova-blue/ui/share-button.tsx': () => <><ShareButton pageContent="A sample portfolio article." pageUrl="https://example.com/article" /><Toaster /></>,
  'registry/nova-blue/ui/breadcrumb.tsx': () => <Breadcrumb.Breadcrumb><Breadcrumb.BreadcrumbList><Breadcrumb.BreadcrumbItem><Breadcrumb.BreadcrumbLink href="/components">Components</Breadcrumb.BreadcrumbLink></Breadcrumb.BreadcrumbItem><Breadcrumb.BreadcrumbSeparator /><Breadcrumb.BreadcrumbItem><Breadcrumb.BreadcrumbPage>Preview</Breadcrumb.BreadcrumbPage></Breadcrumb.BreadcrumbItem></Breadcrumb.BreadcrumbList></Breadcrumb.Breadcrumb>,
  'registry/nova-blue/ui/dotm-square-11.tsx': () => <DotmSquare11 size={80} />,
  'registry/nova-blue/ui/dotmatrix-core.tsx': () => <DotMatrixBase size={80} phase="loadingRipple" />,
  'registry/nova-blue/ui/hover-card.tsx': () => <HoverCard><HoverCardTrigger className="border px-4 py-2">Hover to explore</HoverCardTrigger><HoverCardContent><p className="font-semibold">Portfolio</p><p className="mt-2">Build something thoughtful.</p></HoverCardContent></HoverCard>,
}

export default function RegistryDemos({ path }: { path: string }) {
  if (!Object.hasOwn(registryDemos, path)) throw new Error(`Missing live preview: ${path}`)
  const Demo = registryDemos[path as keyof typeof registryDemos]
  return <div className="relative isolate flex min-h-80 w-full items-center justify-center rounded-xl border border-border bg-background p-6 [transform:translateZ(0)] md:p-10"><Demo /></div>
}
