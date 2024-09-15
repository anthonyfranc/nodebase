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
    <UIcon name="solar:bolt-bold-duotone" style="color: #14cc76" class="h-6"/>
      Nodebase
    </template>

    <template #right>
      <template v-if="page.buttons">
        <UButton
          v-for="(button, index) in page.buttons"
          :key="index"
          :label="button.label"
          :color="button.color"
          :to="button.to"
          :icon="button.icon"
          :trailing="button.trailing"
          :class="button.class"
        />
      </template>
    </template>

    <template #panel>
        <UHeaderPopoverLinks :links="page.links" />
    </template>
  </UHeader>
</template>
