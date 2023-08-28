import {defineCollection, z} from "astro:content";

const lessonCollection = defineCollection({
  type: "data",
  schema: z.object({
    data: z.array(z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string()
    }))
  })
})

const courseCollection = defineCollection({
  type: "data",
  schema: z.object({
    courses: z.array(z.object({
      slug: z.string(),
      icon: z.string(),
      language: z.string(),
      header: z.string(),
      description: z.string()
    }))
  })
})

export const collections = {
  'lessons': {
    'arduino': lessonCollection,
    'css': lessonCollection,
    'html': lessonCollection,
    'javascript': lessonCollection,
    'python': lessonCollection,
    'courses': courseCollection,
    'type': "data"
  },
}