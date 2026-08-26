<script setup lang="ts">
import type {ButtonProps} from "#ui/components/Button.vue";

const heroLinks = ref<ButtonProps[]>([
  {
    label: 'Δείτε τα μαθήματα μας',
    to: '/courses',
  },
  {
    label: 'Μάθετε Περισσότερα',
    to: '/about',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageHero
      headline="Δωρεάν"
      description="Καλωσορίσατε στο Simplified Coding. Εαν δεν ξέρετε με πιο μάθημα θέλετε να ξεκινήσετε, μπορείτε να ακολουθήσετε τον χάρτη μας που θα σας βοηθήσει να επιλέξετε το κατάλληλο μάθημα για εσάς. Μπορείτε επιπλέον να διαλέξετε μια από τις τρείς κατευθύνσεις που προσφέρουμε, αφού ολοκληρώσετε τα βασικά μας μαθήματα."
      :links="heroLinks" orientation="horizontal"
  >
    <template #title>
      Μαθήματα προγραμμα&shy;τισμού στα Ελληνικά
    </template>

    <USkeleton class="h-92 md:h-148 md:mx-2" role="navigation"></USkeleton>
  </UPageHero>
</template>
