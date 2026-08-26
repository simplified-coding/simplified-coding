<script setup lang="ts">
  import {useUserSession} from "#imports";

  await $fetch("/api/auth/sign-out", {
    method: "DELETE",
  }).finally(async () => {
    await useUserSession().fetch()
    await navigateTo("/")
  })
</script>

<template />