<template>
    <!--Hero-->
    <ULandingHero :ui="{
        title: 'sm:text-4xl lg:text-6xl md:text-5xl text-3xl',
        description: 'font-thin',
    }" class="m:text-md" data-aos="fade-down" data-aos-delay="50">
        <template #headline>
            <UBadge variant="subtle" size="md"
                class="hover:bg-primary-100 dark:bg-primary/10 dark:hover:bg-primary/20 transition-color relative font-medium rounded-full shadow-none">
                <UIcon class="mr-1 w-4 h-4 pointer-events-none" :name="page.badge?.icon" />
                <span class="flex items-center gap-1" v-html="page.badge?.title" />
            </UBadge>
        </template>
        <template #title>
            <span v-html="page.hero_intro.title"
                class="dark:bg-gradient-to-b dark:from-white dark:via-slate-50 dark:to-slate-400 dark:bg-clip-text dark:text-transparent" />
        </template>
        <template #description>
            <span v-html="page.hero_intro.description" />
        </template>
        <template #links>
            <template v-for="(button, index) in page.hero_intro.buttons" :key="index">
                <template v-if="index === 0">
                        <UButton :label="button.label" :to="button.link" :size="button.size"
                            :icon="button.icon" :trailing="true" :color="button.color"
                            :ui="{ rounded: 'rounded-full' }"/>
                </template>
                <template v-else>
                    <UButton :label="button.label" :to="button.link" :size="button.size"
                        :icon="button.icon" :trailing="true" :color="button.color" :ui="{ rounded: 'rounded-full' }" />
                </template>
            </template>
        </template>
        <HomeHeroBackground/>
        <Gradient class="absolute inset-x-0 top-0 w-full block" />
    </ULandingHero>
    <!--End of Hero-->
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

definePageMeta({
  layout: "main",
  color: "dark"
});
</script>