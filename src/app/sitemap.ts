import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const goals = await prisma.goal.findMany({
    where: { status: { in: ["ACTIVE", "HIT"] } },
    select: { slug: true, lastUpdatedAt: true },
  });

  const goalEntries: MetadataRoute.Sitemap = goals.map((goal) => ({
    url: `${APP_URL}/goals/${goal.slug}`,
    lastModified: goal.lastUpdatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${APP_URL}/sign-in`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...goalEntries,
  ];
}
