<script setup lang="ts">
import type {StepperItem} from "#ui/components/Stepper.vue";
import {UButton} from "#components";
import {useCourses} from "#imports";
import CourseRecord from "#shared/utils/CourseRecord";

type AllDocsMeta = PouchDB.Core.AllDocsMeta
type DocumentId = PouchDB.Core.DocumentId
type DocumentKey = PouchDB.Core.DocumentKey
type ExistingDocument = PouchDB.Core.ExistingDocument<CourseRecord & AllDocsMeta>

type PouchCourseRecord = {
  doc: ExistingDocument;
  id: DocumentId;
  key: DocumentKey;
};

const stepperItems: Ref<StepperItem[]> = ref([
  {
    title: "Course",
    description: "Select a course",
    icon: 'lucide:mouse-pointer-click',
    slot: "courses"
  },
  {
    title: "Lessons",
    description: "Manage lessons",
    icon: 'lucide:hammer',
    slot: "lessons"
  },
  {
    title: "Editor",
    description: "Edit a draft contents",
    icon: "lucide:notebook-pen",
    slot: "editor"
  }
])

const stepper = useTemplateRef('stepper')

const courses: Ref<PouchCourseRecord[]> = ref([])
const selectedCourse: Ref<PouchCourseRecord | null> = ref(null)

async function refreshCourses() {
  const courseDatabase = await useCourses();
  courses.value
      = await courseDatabase.allDocs({ include_docs: true })
      .then(d => d.rows)
      .then(d => d.filter(v => !v.doc?._id.startsWith("_design/"))) as PouchCourseRecord[]
}

function selectCourse(course: PouchCourseRecord) {
  selectedCourse.value = course
  stepper.value?.next()
}

onMounted(async () => {
  await refreshCourses()
})
</script>

<template>
  <UPageHeader
      title="Lesson Editor"
      description="Access and edit all of Simplified Coding lesson here"
      class="mb-8 mx-2"
  />

  <UStepper :items="stepperItems" disabled ref="stepper">
    <template #courses>
      <div class="flex justify-end mx-6">
        <UButton icon="lucide:refresh-cw" size="md" color="primary" variant="solid" class="mx-2" @click="refreshCourses" />
      </div>

      <ul class="my-6">
        <li v-for="course in courses" :key="course.id" class="my-3">
          <UCard>
            <h1 class="font-bold text-xl">{{course.doc.title}}</h1>
            <p>{{course.doc.description}}</p>

            <template #footer>
              <div class="flex justify-end">
                <UButton @click="() => selectCourse(course  )">Select Course</UButton>
              </div>
            </template>
          </UCard>
        </li>
      </ul>
    </template>
  </UStepper>
</template>
