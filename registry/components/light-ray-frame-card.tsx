import { memo } from "react";
import { CardDescription, CardHeader, CardTitle } from "./card";
import { ShaderFrameCard, type ShaderFrameCardProps } from "./shader-frame-card.shared";
import { LightRayBackground } from "../shader/light-ray-background";

type LightRayFrameCardProps = ShaderFrameCardProps & { speed?: number };

export const LightRayFrameCard = memo(function LightRayFrameCard({
  speed = 0.1,
  children = (
    <CardHeader>
      <CardTitle>Follow the light.</CardTitle>
      <CardDescription>
        Curved strands of light flow around a quiet space for your next idea.
      </CardDescription>
    </CardHeader>
  ),
  ...props
}: LightRayFrameCardProps = {}) {
  return (
    <ShaderFrameCard
      {...props}
      slot="light-ray-frame-card"
      background={
        <LightRayBackground
          intensity={1.4}
          speed={speed}
          interactive={false}
          className="absolute inset-0 h-full min-h-0! w-full border-0"
        />
      }
    >
      {children}
    </ShaderFrameCard>
  );
});
