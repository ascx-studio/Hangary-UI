"use client";

import { SplitSignIn } from "@/registry/blocks/split-sign-in";
import { SocialSignIn } from "@/registry/blocks/social-sign-in";
import { WorkspaceSignUp } from "@/registry/blocks/workspace-sign-up";
import { MagicLinkSignIn } from "@/registry/blocks/magic-link-sign-in";
import { PortfolioNavbar } from "@/registry/blocks/portfolio-navbar";
import { StudioNavbar } from "@/registry/blocks/studio-navbar";
import { EditorialNavbar } from "@/registry/blocks/editorial-navbar";
import { StorefrontNavbar } from "@/registry/blocks/storefront-navbar";
import { StudioHero } from "@/registry/blocks/studio-hero";
import { ContactFooter } from "@/registry/blocks/contact-footer";
import { StudioFooter } from "@/registry/blocks/studio-footer";
import { NewsletterFooter } from "@/registry/blocks/newsletter-footer";
import { StorefrontFooter } from "@/registry/blocks/storefront-footer";
import { SeasonTimeline } from "@/registry/components/season-timeline";
import { AuroraVeil } from "@/registry/shader/aurora-veil";
import { DaylightAtlas } from "@/registry/blocks/daylight-atlas";
import { OrbitSelector } from "@/registry/components/orbit-selector";
import { SecretTicket } from "@/registry/components/secret-ticket";
import { ContourDrift } from "@/registry/shader/contour-drift";
import { PrismRibbon } from "@/registry/shader/prism-ribbon";
import { SignalDial } from "@/registry/components/signal-dial";
import { ListeningStation } from "@/registry/blocks/listening-station";
import { Interference } from "@/registry/shader/interference";
import { DitherField } from "@/registry/shader/dither-field";
import Preview from "./preview";

export default function ComponentPreview({ name }: { name: string }) {
  const shader = ["interference", "contour-drift", "prism-ribbon", "aurora-veil", "dither-field"].includes(name);
  const content = (() => {
    switch (name) {
      case "split-sign-in":
        return <SplitSignIn />;
      case "social-sign-in":
        return <SocialSignIn />;
      case "workspace-sign-up":
        return <WorkspaceSignUp />;
      case "magic-link-sign-in":
        return <MagicLinkSignIn />;
      case "portfolio-navbar":
        return <PortfolioNavbar />;
      case "studio-navbar":
        return <StudioNavbar />;
      case "editorial-navbar":
        return <EditorialNavbar />;
      case "storefront-navbar":
        return <StorefrontNavbar />;
      case "studio-hero":
        return <StudioHero />;
      case "contact-footer":
        return <ContactFooter />;
      case "studio-footer":
        return <StudioFooter />;
      case "newsletter-footer":
        return <NewsletterFooter />;
      case "storefront-footer":
        return <StorefrontFooter />;
      case "season-timeline":
        return <SeasonTimeline />;
      case "aurora-veil":
        return <AuroraVeil />;
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
      default:
        return <p className="text-center text-sm text-muted-foreground">Preview coming soon.</p>;
    }
  })();

  return (
    <Preview className="h-full min-h-0 w-full max-w-none justify-start overflow-hidden p-0 sm:p-0">
      <div className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-auto p-4 sm:p-6">
        <div className={`my-auto w-full shrink-0 ${shader ? "h-full overflow-hidden " : ""}`}>
          {content}
        </div>
      </div>
    </Preview>
  );
}
