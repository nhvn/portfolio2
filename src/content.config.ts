import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    role: z.string().optional(),
    team: z.string().optional(),
    duration: z.string().optional(),
    contributions: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, projects };
