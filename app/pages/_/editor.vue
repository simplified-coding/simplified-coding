<script setup lang="ts">
import CourseEditorIndex from "~/components/editor/CourseEditorIndex.vue";
import LessonEditorIndex from "~/components/editor/LessonEditorIndex.vue";

const { loggedIn } = useUserSession()
if (!loggedIn.value)
  await navigateTo("/")

const tabs = [
  {
    label: "Intro",
    icon: "lucide:package",
    slot: "intro"
  },
  {
    label: "Courses",
    icon: "lucide:package-search",
    slot: "courses"
  },
  {
    label: "Lessons",
    icon: "lucide:package-open",
    slot: "lessons"
  },
  {
    label: "Users",
    icon: "lucide:circle-user-round",
    slot: "users"
  }
]

useHead({
  title: "Simplified Coding | Editor",
  htmlAttrs: {
    lang: "el"
  }
})
</script>

<template>
  <UTabs :items="tabs">
    <template #intro>
      <UPageHeader
          title="Content Editor"
          description="Simplified Coding internal content editor"
          class="mb-8 mx-2"
      />
    </template>

    <template #courses>
      <CourseEditorIndex hydrate-on-visible />
    </template>

    <template #lessons>
      <LessonEditorIndex hydrate-on-visible />
    </template>
  </UTabs>
</template>