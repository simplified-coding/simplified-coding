<script setup lang="ts">
import type {StepperItem} from "#ui/components/Stepper.vue";
import type {FormSubmitEvent} from "#ui/types";
import {useUserSession} from "#imports";
import {type RequestCodeDto, requestCodeDto} from "#shared/utils/requestCodeDto";
import {type ConfirmCodeDto, confirmCodeDto} from "#shared/utils/confirmCodeDto";

const items: StepperItem[] = [
  {
    title: "Credentials",
    description: "Enter your login details",
    icon: "lucide:form",
    slot: "request-code-form" as const
  },
  {
    title: "Verification",
    description: "Confirm your verification code",
    icon: "lucide:lock",
    slot: "confirm-code-form" as const
  }
]

const stepper = useTemplateRef("stepper")
const requestState = reactive<Partial<RequestCodeDto>>({email: undefined})
const confirmState = reactive<Partial<ConfirmCodeDto>>({email: undefined, code: undefined})
const toast = useToast()

async function onRequestCodeFormSubmit(e: FormSubmitEvent<RequestCodeDto>) {
  try {
    await $fetch("/api/auth/request-code", {
      method: "POST",
      body: e.data
    })

    toast.add({
      title: "Code Email Notification",
      description: `${e.data.email}, check your email for a verification code!`,
      color: "success"
    });

    confirmState.email = e.data.email
    stepper.value?.next();
  } catch (_) {
    toast.add({
      title: "Unexpected Error",
      description: "Failed to send verification code. Please try again later",
      color: "error"
    });
  }
}

async function onConfirmCodeFormSubmit(e: FormSubmitEvent<ConfirmCodeDto>) {
  try {
    await $fetch("/api/auth/confirm-code", {
      method: "POST",
      body: e.data,
    });

    await useUserSession().fetch()

    toast.add({
      title: "Login Successful",
      description: `Welcome, ${e.data.email}, to your account`,
      color: "success"
    })
  } catch (_) {
    toast.add({
      title: "Unexpected Error",
      description: "Failed to login.",
      color: "error"
    });
  }
}
</script>

<template>
  <UPageHeader
      title="Login to Simplified Coding"
      description="Login to your Simplified Coding account to manage your learning progress"
      class="mb-8 mx-2"
  />

  <UCard>
    <UStepper :items="items" ref="stepper" disabled>
      <template #request-code-form>
          <UForm class="space-y-4 py-8 flex flex-col items-center"
                 :state="requestState" :schema="requestCodeDto" @submit="onRequestCodeFormSubmit">
            <UFormField label="Email" name="email">
              <UInput class="w-xs sm:w-sm md:w-lg" v-model="requestState.email" />
            </UFormField>

            <UButton type="submit" trailing-icon="lucide:arrow-right">
              Continue
            </UButton>
          </UForm>
      </template>

      <template #confirm-code-form>
        <UForm class="space-y-4 py-8 flex flex-col items-center"
               :state="confirmState" :schema="confirmCodeDto" @submit="onConfirmCodeFormSubmit">
          <UFormField label="Email" name="email">
            <UInput class="w-xs sm:w-sm md:w-lg" v-model="confirmState.email" disabled />
          </UFormField>

          <UFormField label="Code" name="code">
            <UInput class="w-xs sm:w-sm md:w-lg" v-model="confirmState.code"/>
          </UFormField>

          <div class="flex">
            <UButton
                leading-icon="i-lucide-arrow-left"
                :disabled="!stepper?.hasPrev"
                variant="subtle"
                color="neutral"
                class="mx-2"
                @click="stepper?.prev()">
              Go Back
            </UButton>

            <UButton type="submit" trailing-icon="lucide:arrow-right" class="mx-2">
              Login
            </UButton>
          </div>
        </UForm>
      </template>
    </UStepper>
  </UCard>
</template>