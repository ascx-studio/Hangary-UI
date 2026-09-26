'use client'

import { useState } from 'react'
import MobileMenu from '@/registry/nova-blue/blocks/mobile-menu'

export default function MobileMenuDemo() {
  const [open, setOpen] = useState(true)
  return <div className="relative min-h-96 w-full [&>div]:static [&>div]:block"><button onClick={() => setOpen(!open)} className="border p-3">{open ? 'Close menu' : 'Open menu'}</button>{open && <MobileMenu onClose={() => setOpen(false)} />}</div>
}
