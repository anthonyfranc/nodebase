<script setup lang="ts">
const { data: page } = await useAsyncData('links', () =>
  queryContent('appheader').findOne()
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}
</script>

<template>
  <UHeader :links="page.links">
    <template #logo>
      <AppLogo />
    </template>
    <template #right>
      <UColorModeButton />
    </template>
    <template #panel>
        <UHeaderPopoverLinks :links="page.links" />
    </template>
  </UHeader>
</template>
