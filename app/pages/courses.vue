<script setup lang="ts">
  import useCourses from "~/utils/useCourses";

  const courses: Ref<Array<PouchDB.Core.ExistingDocument<CourseRecord>>> = ref([]);

  onMounted(async () => {
    const db = await useCourses();
    const docs = await db.find({selector: {draft: false}});
    courses.value = docs.docs.filter(d => !d._id.startsWith("_design/"))
  })

  useHead({
    title: "Simplified Coding | Σειρές Μαθημάτων",
    htmlAttrs: {
      lang: "el"
    }
  })
</script>

<template>
  <UPageHeader
      title="Σειρές Μαθημάτων"
      description="Δείτε τις σείρες μαθημάτων του Simplified Coding."
      class="mb-8 mx-2"
  />

  <UCard v-for="course in courses" :key="course.id" class="my-4" :title="course.title">
    <template #title>
      <div class="flex items-center">
        <UIcon :name="course.icon" class="size-6" />
        <p class="inline mx-4 text-2xl">{{course.title}}</p>
      </div>
    </template>

    <template #description>
      {{course.language}} ⸱ {{course.requirements}}
    </template>

    <template #footer>
      <UButton class="mx-2" icon="lucide:eye" size="md" color="primary" variant="solid"
       :to="`/course/${course._id}`">Δές το μάθημα</UButton>
    </template>

    <div class="flex mb-2">
      <UBadge color="secondary" class="mx-1">Διαρκεί περίπου {{course.duration}}</UBadge>
      <UBadge color="warning" class="mx-1">
        Βαθμός Δυσκολίας
        <UIcon name="material-symbols:star-rounded" class="size-5" v-for="i in course.difficulty" :key="i"/>
      </UBadge>
    </div>

    {{course.description}}
  </UCard>
</template>