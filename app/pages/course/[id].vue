<script setup lang="ts">
  const route = useRoute()
  const id = route.params.id as string

  const toast = useToast()

  const course: Ref<CourseRecord | null> = ref(null)
  const lessons: Ref<LessonRecord[] | null> = ref(null)

  const completion: Ref<number> = ref<number>(0)

  function mapLessonTitle(lesson: LessonRecord): LessonRecord {
    lesson.title = `Μάθημα ${lesson.index} - ${lesson.title}`
    return lesson
  }

  onMounted(async () => {
    const coursesDb = await useCourses()
    const lessonsDb = await useLessons()

    course.value = await coursesDb.get(id).catch(async (_) => {
      await navigateTo("/courses")
      toast.add({
        title: "Η Σείρα Μαθημάτων δέν βρέθηκε.",
        description: "Η επιλεγμένη σειρά μαθημάτων δέν βρέθηκε στη τοποική βάση δεδομένων. Προσπασθήστε ξανά με σύνδεση στο Internet.",
        color: "error"
      })
    })

    lessons.value = await lessonsDb.find({
      selector: {
        draft: false,
        courseId: id
      }
    }).then(d => d.docs.map(mapLessonTitle))

    console.log(lessons.value)
  })

  useHead({
    title: `Simplified Coding | Μαθήματα ${id}`,
    htmlAttrs: {
      lang: "el"
    }
  })
</script>

<template>
  <div v-if="course">
    <UPageHeader
        :title="course.title"
        :description="course.description"
        class="mb-8 mx-2">
      <div class="mt-2">
        <UBadge color="secondary" class="mx-1">Διαρκεί περίπου {{course.duration}}</UBadge>
        <UBadge color="warning" class="mx-1">
          Βαθμός Δυσκολίας
          <UIcon name="material-symbols:star-rounded" class="size-5" v-for="i in course.difficulty" :key="i"/>
        </UBadge>

        <UProgress v-model="completion" class="mt-2" status />
      </div>
    </UPageHeader>

    <UCard class="my-2" v-for="lesson in lessons" :key="lesson._id" variant="subtle">
      <template #header>
        <div class="flex items-center">
          <UCheckbox class="ml-2 mr-6" size="xl" />
          <div>
            <h3 class="font-semibold text-lg">{{lesson.title}}</h3>
            <p>{{lesson.description}}</p>
          </div>
        </div>
      </template>

      <div class="flex justify-end">
        <UButton class="mx=2" :to="`/course/${id}/${lesson.index}/view`">Άρχισε (χωρίς τον Editor)</UButton>
        <UButton class="mx-2" :to="`/course/${id}/${lesson.index}/editor`">Άρχισε (με τον Editor)</UButton>
        <UButton class="mx-2" color="secondary">Δές τις ασκήσεις</UButton>
      </div>
    </UCard>
  </div>

  <div v-else>
    <div class="flex justify-center items-center h-screen animate-spin">
      <UIcon name="lucide:loader-circle" class="size-12" />
    </div>
  </div>
</template>
