import type { MetadataRoute } from 'next';
import { getRegistryItems, getRegistryItemHref, registryHomepage } from '@/lib/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/components', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blocks', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/shader', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/sponser', changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  return [
    ...pages.map(({ path, ...metadata }) => ({
      url: new URL(path, registryHomepage).toString(),
      ...metadata,
    })),
    ...(['components', 'blocks', 'shader'] as const).flatMap((category) =>
      getRegistryItems(category).map((item) => ({
        url: new URL(getRegistryItemHref(item), registryHomepage).toString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ),
  ];
}