<script setup lang="ts">
import type {TableColumn} from "#ui/components/Table.vue";
import {UButton, UCheckbox, UIcon} from "#components";
import useCourses from "~/utils/useCourses";
import CourseRecord, {courseRecordSchema} from "#shared/utils/CourseRecord";
import useRemotePouchDB from "~/utils/useRemotePouchDB";
import { v7 as uuidv7 } from 'uuid';

  type AllDocsMeta = PouchDB.Core.AllDocsMeta
  type DocumentId = PouchDB.Core.DocumentId
  type DocumentKey = PouchDB.Core.DocumentKey
  type ExistingDocument = PouchDB.Core.ExistingDocument<CourseRecord & AllDocsMeta>

  type PouchCourseRecord = {
    doc: ExistingDocument;
    id: DocumentId;
    key: DocumentKey;
  };

  function limit(v: string, lmt: number): string {
    return v.length > lmt
        ? `${v.slice(0, lmt)}...`
        : v
  }

  const courses: Ref<PouchCourseRecord[] | null> = ref(null);
  const editModal: Ref<boolean> = ref(false);
  const deleteModal: Ref<boolean> = ref(false);

  const selectedCourseId: Ref<string | null> = ref(null);
  const selectedCourse: Ref<CourseRecord | null> = ref(null);

  const needsToSync: Ref<boolean> = ref(false);

  watchEffect(async () => {
    const id = selectedCourseId.value;
    if (id === null)
      selectedCourse.value = null;

    const courseDb = await useCourses();
    selectedCourse.value = await courseDb.get(id!).catch(_ =>
        new CourseRecord("","","Δεν χρειάζεται προηγούμενη γνώση","","","",1,true));
  })

  const columns: TableColumn<PouchCourseRecord>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Slug'
    },
    {
      id: "icon",
      accessorKey: 'doc.icon',
      header: 'Icon',
      cell: ({row}) => h(UIcon, {name: row.getValue<string>("icon"), class: "size-6"})
    },
    {
      accessorKey: 'doc.title',
      header: 'Title'
    },
    {
      id: "description",
      accessorKey: 'doc.description',
      header: 'Description',
      cell: ({row}) => limit(row.getValue<string>("description"), 48)
    },
    {
      accessorKey: "doc.language",
      header: 'Language'
    },
    {
      accessorKey: "doc.requirements",
      header: 'Requirements'
    },
    {
      accessorKey: "doc.difficulty",
      header: 'Difficulty'
    },
    {
      accessorKey: "doc.duration",
      header: 'Duration'
    },
    {
      id: "draft",
      accessorKey: "doc.draft",
      header: 'Draft',
      cell: ({row}) => h(UCheckbox, {disabled: true, defaultValue: row.getValue<boolean>("draft")})
    },
    {
      id: "action-edit",
      meta: {class: {td: "text-right"}},
      cell: ({row}) => h(UButton, {size: "md", variant: "outline", icon: "lucide:pencil", onClick: () => onEdit(row.getValue("id"))})
    },
    {
      id: "action-delete",
      meta: {class: {td: "text-right"}},
      cell: ({row}) => h(UButton, {size: "md", variant: "outline", icon: "lucide:trash-2", color: "error", onClick: () => onDelete(row.getValue("id"))})
    }
  ]

  async function refresh(): Promise<void> {
    const courseDatabase = await useCourses()
    courses.value
        = await courseDatabase.allDocs({ include_docs: true })
        .then(d => d.rows)
        .then(d => d.filter(v => !v.doc?._id.startsWith("_design/"))) as PouchCourseRecord[]
  }

  function onEdit(id: string): void {
    selectedCourseId.value = null;
    selectedCourseId.value = id;
    editModal.value = !editModal.value;
  }

  function onDelete(id: string): void {
    selectedCourseId.value = null;
    selectedCourseId.value = id;
    deleteModal.value = true;
  }

  function onAdd(): void {
    selectedCourseId.value = uuidv7().toString();
    editModal.value = true;
  }

  async function onSubmit(): Promise<void> {
    const courseDatabase = await useCourses();
    const currentRev = await courseDatabase.get(selectedCourseId.value!).catch(_ => null);

    if (currentRev != null) {
      const newRev = {
        _id: currentRev._id,
        _rev: currentRev._rev,
        ...selectedCourse.value,
      }

      await courseDatabase.put(newRev as CourseRecord)
    } else {
      const newRev = {
        _id: selectedCourseId.value!,
        ...selectedCourse.value,
      }

      await courseDatabase.put(newRev as CourseRecord)
    }

    await refresh()

    needsToSync.value = true;
    editModal.value = false;
  }

  async function onDeleteOk(): Promise<void> {
    const courseDatabase = await useCourses();
    const currentRev = await courseDatabase.get(selectedCourseId.value!);

    const currentDoc = {
      _id: currentRev._id,
      _rev: currentRev._rev,
      ...selectedCourse.value,
    }

    await courseDatabase.remove(currentDoc)
    await refresh()

    needsToSync.value = true;
    deleteModal.value = false;
  }

  async function onPush(): Promise<void> {
    const local = useLocalPouchDB("courses") as PouchDB.Database<CourseRecord>;
    const remote = useRemotePouchDB("sc-courses") as PouchDB.Database<CourseRecord>;

    await remote.replicate.from(local).catch(e => console.error(e));
    needsToSync.value = false;
  }

  async function onPull(): Promise<void> {
    const local = useLocalPouchDB("courses") as PouchDB.Database<CourseRecord>;
    await local.destroy()

    await refresh()
    needsToSync.value = false;
  }

  onMounted(async () => {
    await refresh();
  })
</script>

<template>
  <UModal v-model:open="deleteModal">
    <template #content>
      <div class="p-4">
        <div>
          <h1 class="font-semibold text-xl">Are you sure you want to delete this course?</h1>
          <p>{{selectedCourse?.title}}</p>
        </div>

        <div class="flex justify-end">
          <UButton class="mx-2" variant="subtle" color="neutral" @click="deleteModal = false">Cancel</UButton>
          <UButton class="mx-2" color="error" @click="onDeleteOk">Ok</UButton>
        </div>
      </div>
    </template>
  </UModal>

  <USlideover v-model:open="editModal" side="left">
    <template #content>
      <div class="p-4 overflow-y-auto">
        <div>
          <h1 class="font-semibold text-xl">Edit Course</h1>
          <p>{{selectedCourse?.title}}</p>
        </div>

        <UForm class="my-8" :schema="courseRecordSchema" :state="selectedCourse" v-if="selectedCourse" @submit="onSubmit">
          <UFormField label="Slug" hint="Required" size="xl" class="my-2">
            <UInput class="w-full" required :default-value="selectedCourseId!" disabled/>
          </UFormField>

          <UFormField label="Icon" hint="Required" size="xl" class="my-2">
            <div class="flex justify-center items-center">
              <UIcon :name="selectedCourse.icon" class="size-12 mx-4" />
              <UInput class="w-full" required v-model="selectedCourse.icon"/>
            </div>
          </UFormField>

          <UFormField label="Title" hint="Required" help="3-80 Characters" size="xl" class="my-2">
            <UInput class="w-full" required v-model="selectedCourse.title"/>
          </UFormField>

          <UFormField label="Description" hint="Required" help="0-65535 Characters" size="xl" class="my-2">
            <UTextarea class="w-full" v-model="selectedCourse.description" />
          </UFormField>

          <UFormField label="Requirements" hint="Optional" help="0-80 Characters" size="xl" class="my-2">
            <UInput class="w-full" v-model="selectedCourse.requirements" />
          </UFormField>

          <UFormField label="Language" hint="Required" help="0-32 Characters" size="xl" class="my-2">
            <UInput class="w-full" required v-model="selectedCourse.language" />
          </UFormField>

          <UFormField label="Duration" hint="Required" help="0-24 Characters" size="xl" class="my-2">
            <UInput class="w-full" required v-model="selectedCourse.duration" />
          </UFormField>

          <UFormField label="Difficulty" hint="Required" size="xl" class="my-2">
            <UInputNumber class="w-full" :min="1" :max="5" required v-model="selectedCourse.difficulty" />
          </UFormField>

          <UFormField label="Draft" hint="Required" size="xl" class="my-2">
            <UCheckbox class="w-full" required v-model="selectedCourse.draft" />
          </UFormField>

          <UButton type="submit" class="my-4" block>
            Save
          </UButton>

          <UButton color="neutral" variant="outline" block @click="editModal = false">
            Cancel
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>

  <UPageHeader
      title="Course Editor"
      description="Access and edit all of Simplified Coding Courses here"
      class="mb-8 mx-2"
  />

  <div v-if="courses != null">
    <div class="flex justify-between mx-8 my-2">
      <UButton icon="lucide:plus" size="md" color="primary" variant="solid" class="mx-2" @click="onAdd" />

      <div>
        <UButton icon="lucide:refresh-cw" size="md" color="primary" variant="solid" class="mx-2" @click="refresh" />

        <UButton icon="lucide:arrow-big-up-dash" size="md" color="primary" variant="solid" class="mx-2" v-if="!needsToSync" @click="onPush" />
        <UChip class="mx-2" v-else>
          <UButton icon="lucide:arrow-big-up-dash" size="md" color="primary" variant="solid" @click="onPush" />
        </UChip>

        <UButton icon="lucide:arrow-big-down-dash" size="md" color="primary" variant="solid" class="mx-2" @click="onPull" :disabled="!needsToSync" />
      </div>
    </div>
    <UTable :data="courses" :columns="columns" class="flex-1" />
  </div>
  <div v-else>
    <div class="flex justify-center items-center h-screen animate-spin">
      <UIcon name="lucide:loader-circle" class="size-12" />
    </div>
  </div>
</template>
