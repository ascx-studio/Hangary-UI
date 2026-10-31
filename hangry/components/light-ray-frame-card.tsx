import { memo } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/hangry/components/card";
import { ShaderFrameCard, type ShaderFrameCardProps } from "@/hangry/components/shader-frame-card.shared";
import { RayFieldBackground } from "@/hangry/shader/ray-field-background";

type LightRayFrameCardProps = ShaderFrameCardProps & { speed?: number };

export const LightRayFrameCard = memo(function LightRayFrameCard({
  speed = 1,
  children = (
    <CardHeader>
      <CardTitle>Follow the light.</CardTitle>
      <CardDescription>
        A sweeping light ray frames a quiet space for your next idea.
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
        <RayFieldBackground
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
