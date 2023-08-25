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

export const collections = {
  'lessons': {
    'arduino': lessonCollection,
    'css': lessonCollection,
    'html': lessonCollection,
    'javascript': lessonCollection,
    'python': lessonCollection,
    'type': "data"
  }
}