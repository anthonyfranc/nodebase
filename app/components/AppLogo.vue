<script setup lang="ts">
const { data: page } = await useAsyncData('links', () =>
  queryContent('appheader').findOne()
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}
</script>

<template>
  <div class="flex items-center">
    <UIcon :name="page.icon.name" :style="page.icon.style" :class="page.icon.class" />
    <span class="font-thin text-2xl">{{ page.label }}</span>
  </div>
</template>
