<script setup lang="ts">

import type {NavigationMenuItem} from "@nuxt/ui/components/NavigationMenu.vue";
import useAvatar from "~/utils/useAvatar";
import {createAvatar} from "@dicebear/core";
import {identicon} from "@dicebear/collection";

const { user } = useUserSession()

const routes = [
    {
      label: "Αρχική",
      icon: "lucide:house",
      to: '/',
    },
    {
      label: "Σχετικά με εμάς",
      icon: "lucide:info",
      to: '/about'
    },
    {
      label: "Σειρές μαθημάτων",
      icon: "lucide:notebook-text",
      to: "/courses"
    }
];

const navigationItems = computed<NavigationMenuItem[]>(() => {
  if (user.value != null && user.value.roles.indexOf("editor") != -1)
    return [
      ...routes,
      {
        label: "Content Editor",
        icon: "lucide:pencil",
        to: "/_/editor"
      }
    ]

  return routes
})

useHead({
  title: "Simplified Coding | Home",
  htmlAttrs: {
    lang: "el"
  }
})
</script>

<template>
  <UApp >
    <div role="alert">
      <UBanner icon="lucide:construction" title="Αυτός ο ιστότοπος βρίσκεται υπό κατασκευή. Παρακαλούμε να αναφέρετε τυχόν προβλήματα στο GitHub χρησιμοποιώντας την ετικέτα &quot;nextgen&quot;." />
    </div>

    <UHeader title="Simplified Coding">
      <UNavigationMenu :items="navigationItems" />
      <template #title>
        <div class="flex items-center">
          <NuxtImg src="/favicon.png" class="w-12 mr-2" aria-label="Simplified Coding Logo" />
          Simplified Coding
        </div>
      </template>

      <template #right>
        <AuthState v-slot="{ loggedIn }">
          <div v-if="loggedIn" class="flex items-center">
            <UButton icon="lucide:log-out" size="md" color="primary" variant="solid" to="/auth/sign_out" class="mx-2">Sign Out</UButton>
            <UButton :avatar="{ src: useAvatar(), loading: 'lazy', alt: 'User Avatar' }" class="mx-2" size="xl" variant="ghost" to="/me" />
          </div>
          <UButton icon="lucide:log-in" size="md" color="primary" variant="solid" to="/auth/sign_in"
                   v-else>Sign In</UButton>
        </AuthState>
      </template>

      <!-- Mobile Navigation-->
      <template #body>
        <UNavigationMenu :items="navigationItems" orientation="vertical" />
      </template>
    </UHeader>

    <UMain class="mx-2 md:mx-4 md:my-2">
      <NuxtLayout>
        <NuxtPage></NuxtPage>
      </NuxtLayout>
    </UMain>

    <USeparator />
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright Simplified Coding © 2026 - Mε επιφύλαξη μερικών νόμιμων δικαιωμάτων
          Πληροφορίες για τις άδειες χρησείς, πατήστε <NuxtLink to="/about" class="font-bold">εδώ</NuxtLink>.
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
