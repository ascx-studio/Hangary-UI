"use client";

import { Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { memo, useState } from "react";
import { Bun, NPM, PnpmDark } from "@ridemountainpig/svgl-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/components/tabs";
import { CodeBlock } from "@/registry/components/code-block";

const managers = [
  { name: "bun", prefix: "bunx", icon: Bun },
  { name: "npm", prefix: "npx", icon: NPM },
  { name: "pnpm", prefix: "pnpm dlx", icon: PnpmDark },
];

const InstallationMenu = memo(function InstallationMenu({ name }: { name: string }) {
  const [selected, setSelected] = useState("prompt");
  const reducedMotion = useReducedMotion();
  const animation = {
    initial: reducedMotion ? (false as const) : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.2 },
  };
  return (
    <Tabs value={selected} onValueChange={setSelected} className="relative">
      <TabsList aria-label="Installation package manager">
        <TabsTrigger value="prompt">
          <Sparkles className="size-4 shrink-0" aria-hidden="true" />
          Prompt
        </TabsTrigger>
        {managers.map(({ name: manager, icon: Icon }) => (
          <TabsTrigger key={manager} value={manager}>
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {manager}
          </TabsTrigger>
        ))}
      </TabsList>
      {managers.map(({ name: manager, prefix }) => (
        <TabsContent key={manager} value={manager}>
          {selected === manager && (
            <motion.div key={manager} {...animation}>
              <CodeBlock
                language="bash"
                code={`${prefix} shadcn@latest add https://ui.razeev.com/r/${name}.json`}
              />
            </motion.div>
          )}
        </TabsContent>
      ))}
      <TabsContent value="prompt">
        {selected === "prompt" && (
          <motion.div key="prompt" {...animation}>
            <CodeBlock
              language="text"
              code={`Add the ${name} component from Hangry UI to this project.

Use the project's package manager to run:
shadcn@latest add https://ui.razeev.com/r/${name}.json

Integrate the component with the existing layout and styling.
Keep its interactions and reduced-motion support intact.`}
            />
          </motion.div>
        )}
      </TabsContent>
    </Tabs>
  );
});

export default InstallationMenu;
