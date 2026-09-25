interface CredlyBadgeTemplate {
  name: string;
  description?: string;
  image_url?: string;
  issuer?: {
    name: string;
  };
}

interface CredlyBadgeResponse {
  id: string;
  issued_at?: string;
  badge_template: CredlyBadgeTemplate;
}

export interface CredlyBadgeItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  issuer?: {
    name: string;
  };
  issued_at?: string;
}

const CREDLY_URL =
  "https://www.credly.com/users/e17d1c8e-ffef-44e7-b80d-5897e1d3c823/badges.json";

export async function getCredlyBadges(): Promise<CredlyBadgeItem[]> {
  const res = await fetch(CREDLY_URL, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Credly fetch failed: ${res.status}`);

  const data = await res.json();
  const badges = data.data as CredlyBadgeResponse[];

  // Transform nested structure into flat structure
  return badges.map((badge) => ({
    id: badge.id,
    name: badge.badge_template.name,
    description: badge.badge_template.description,
    image_url: badge.badge_template.image_url,
    issuer: badge.badge_template.issuer,
    issued_at: badge.issued_at,
  }));
}
