'use client'

import { useState } from 'react'
import { AuroraBars } from '@/registry/nova-blue/backgrounds/aurora-bars'
import GhostFibers from '@/registry/nova-blue/backgrounds/ghost-fibers'
import { NoiseOverlay, LightLeaks } from '@/registry/nova-blue/backgrounds/nebula'
import { TopographicCanvas } from '@/registry/nova-blue/backgrounds/topographic'
import Button from '@/components/Button'

export default function ShaderPreview({ name }: { name: string }) {
  const [running, setRunning] = useState(true)
  return (
    <div className="space-y-3">
      <Button variant="base" onClick={() => setRunning(!running)}>{running ? 'Stop animation' : 'Start animation'}</Button>
      <div className="relative isolate h-96 w-full overflow-hidden border border-border bg-zinc-950 text-white [transform:translateZ(0)]" aria-label={name}>
        {running ? <>
          {name === 'portfolio-aurora-bars' && <AuroraBars />}
          {name === 'portfolio-ghost-fibers' && <GhostFibers />}
          {name === 'portfolio-topographic' && <TopographicCanvas />}
          {name === 'portfolio-nebula' && <><LightLeaks /><NoiseOverlay /><p className="absolute inset-0 grid place-items-center text-4xl font-semibold">Nebula</p></>}
        </> : <p className="grid h-full place-items-center text-sm">Animation stopped</p>}
      </div>
    </div>
  )
}
