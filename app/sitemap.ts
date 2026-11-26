import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/board`, changeFrequency: "daily", priority: 0.5 },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.id}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
