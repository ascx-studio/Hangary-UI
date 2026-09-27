import { AuthBlock } from "@/registry/blocks/auth";
import { NavbarBlock } from "@/registry/blocks/navbar";
import { HeroBlock } from "@/registry/blocks/hero";
import { FooterBlock } from "@/registry/blocks/footer";
import { SeasonTimeline } from "@/registry/components/season-timeline";
import { AuroraVeil } from "@/registry/shader/aurora-veil";
import { Daybreak } from "@/registry/templates/daybreak";
import { DaylightAtlas } from "@/registry/blocks/daylight-atlas";
import { OrbitSelector } from "@/registry/components/orbit-selector";
import { SecretTicket } from "@/registry/components/secret-ticket";
import { ContourDrift } from "@/registry/shader/contour-drift";
import { PrismRibbon } from "@/registry/shader/prism-ribbon";
import { SignalDial } from "@/registry/components/signal-dial";
import { ListeningStation } from "@/registry/blocks/listening-station";
import { Interference } from "@/registry/shader/interference";
import { Fieldwork } from "@/registry/templates/fieldwork";
import Preview from "./preview";
import type { ReactNode } from "react";

export default function ComponentPreview({ name, footer }: { name: string; footer?: ReactNode }) {
  const shader = ["interference", "contour-drift", "prism-ribbon", "aurora-veil"].includes(name);
  const content = (() => {
    switch (name) {
      case "auth":
        return <AuthBlock />;
      case "navbar":
        return <NavbarBlock />;
      case "hero":
        return <HeroBlock />;
      case "footer":
        return <FooterBlock />;
      case "season-timeline":
        return <SeasonTimeline />;
      case "aurora-veil":
        return <AuroraVeil />;
      case "daybreak":
        return <Daybreak />;
      case "daylight-atlas":
        return <DaylightAtlas />;
      case "orbit-selector":
        return <OrbitSelector />;
      case "secret-ticket":
        return <SecretTicket />;
      case "contour-drift":
        return <ContourDrift />;
      case "prism-ribbon":
        return <PrismRibbon />;

      case "signal-dial":
        return <SignalDial />;
      case "listening-station":
        return <ListeningStation />;
      case "interference":
        return <Interference />;
      case "fieldwork":
        return <Fieldwork />;
      default:
        return <p className="text-center text-sm text-muted-foreground">Preview coming soon.</p>;
    }
  })();

  return (
    <Preview className="justify-start overflow-hidden p-0 sm:p-0">
      <div className="flex h-[calc(100dvh-12.5rem)] min-h-80 w-full shrink-0 flex-col overflow-auto p-4 sm:p-6 md:h-[calc(100dvh-9.5rem)]">
        <div className={`my-auto w-full shrink-0 ${shader ? "h-full overflow-hidden " : ""}`}>
          {content}
        </div>
      </div>
      {footer && <div className="w-full shrink-0 border-t border-border">{footer}</div>}
    </Preview>
  );
}
