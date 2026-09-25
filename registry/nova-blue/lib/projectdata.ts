"use cache";
import type { Project } from "./constants";
import { getProjectRows } from "./notion/database";

type NotionProperty = {
  type?: string;
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  multi_select?: Array<{ name?: string }>;
  url?: string;
  checkbox?: boolean;
  number?: number;
  files?: Array<{
    name?: string;
    file?: { url?: string };
    external?: { url?: string };
  }>;
};

function getPlainText(prop?: NotionProperty): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.[0]?.plain_text || "";
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text || "";
  return "";
}

function getTechnologies(prop?: NotionProperty): string[] {
  if (!prop) return [];

  if (prop.type === "multi_select") {
    return (prop.multi_select || [])
      .map((item) => item.name || "")
      .filter(Boolean);
  }

  const text = getPlainText(prop);
  if (!text) return [];

  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function getImageUrl(prop?: NotionProperty): string | undefined {
  if (!prop) return undefined;

  // "files" type property (uploaded image or external image)
  if (prop.type === "files") {
    const first = prop.files?.[0];
    return first?.file?.url || first?.external?.url || undefined;
  }

  // Fallback: plain url property used for an image link
  if (prop.type === "url" && prop.url) return prop.url;

  return undefined;
}

function toTechStack(technologies: string[]): Project["tech"] {
  return technologies.reduce<Project["tech"]>((acc, tech) => {
    const key = tech.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    // Keep only the name in data layer; icon is resolved in card layer.
    acc[key] = { id: tech, icon: null };
    return acc;
  }, {});
}

export async function getProjectData(): Promise<Project[]> {
  try {
    const rows = await getProjectRows();

    const projects = rows
      .map((row: any) => {
        const props = (row?.properties || {}) as Record<string, NotionProperty>;

        const technologies = getTechnologies(props.Technologies);

        return {
          title: getPlainText(props.Name) || "Untitled",
          description: getPlainText(props.Description),
          link: props["GitHub Link"]?.url || "",
          liveLink: props["Live Link"]?.url || undefined,
          image: getImageUrl(props.Image),
          tech: toTechStack(technologies),
          featured: !!props.Featured?.checkbox,
          stars:
            typeof props.Stars?.number === "number"
              ? props.Stars.number
              : undefined,
          forks:
            typeof props.Forks?.number === "number"
              ? props.Forks.number
              : undefined,
        } as Project;
      })
      .filter((project) => project.title || project.link);
    return projects.sort(
      (a, b) => Number(!!(b as any).image) - Number(!!(a as any).image),
    );
  } catch (error) {
    console.error("Failed to load project data from Notion:", error);
    return [];
  }
}
