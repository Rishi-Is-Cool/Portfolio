import type { MetadataRoute } from "next";
import { siteUrl, systems } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = systems
    .filter((system) => system.links.some((link) => link.kind === "Case Study"))
    .map((system) => ({
      url: `${siteUrl}/systems/${system.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies,
  ];
}
