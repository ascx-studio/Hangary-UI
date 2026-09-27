"use client";

import { Auth1 } from "@/registry/blocks/auth1";
import { Auth2 } from "@/registry/blocks/auth2";
import { Auth3 } from "@/registry/blocks/auth3";
import { Auth4 } from "@/registry/blocks/auth4";
import { Navbar1 } from "@/registry/blocks/navbar1";
import { Navbar2 } from "@/registry/blocks/navbar2";
import { Navbar3 } from "@/registry/blocks/navbar3";
import { Navbar4 } from "@/registry/blocks/navbar4";
import { HeroBlock } from "@/registry/blocks/hero";
import { Footer1 } from "@/registry/blocks/footer1";
import { Footer2 } from "@/registry/blocks/footer2";
import { Footer3 } from "@/registry/blocks/footer3";
import { Footer4 } from "@/registry/blocks/footer4";
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
import { DitherField } from "@/registry/shader/dither-field";
import { Fieldwork } from "@/registry/templates/fieldwork";
import Preview from "./preview";

export default function ComponentPreview({ name }: { name: string }) {
  const shader = ["interference", "contour-drift", "prism-ribbon", "aurora-veil", "dither-field"].includes(name);
  const content = (() => {
    switch (name) {
      case "auth1":
        return <Auth1 />;
      case "auth2":
        return <Auth2 />;
      case "auth3":
        return <Auth3 />;
      case "auth4":
        return <Auth4 />;
      case "navbar1":
        return <Navbar1 />;
      case "navbar2":
        return <Navbar2 />;
      case "navbar3":
        return <Navbar3 />;
      case "navbar4":
        return <Navbar4 />;
      case "hero":
        return <HeroBlock />;
      case "footer1":
        return <Footer1 />;
      case "footer2":
        return <Footer2 />;
      case "footer3":
        return <Footer3 />;
      case "footer4":
        return <Footer4 />;
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
      case "dither-field":
        return <DitherField />;
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
    </Preview>
  );
}
