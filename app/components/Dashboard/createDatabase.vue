<template>
    <UDashboardModal :prevent-close="true" :closeButton="false" :ui="{
        header: {
            base: '',
            inner: '',
            padding: 'px-4 mt-0.5 sm:px-6'
        },
        body: {
            base: 'flex-1 flex flex-col gap-y-3 overflow-y-auto',
            padding: 'px-4 py-5 sm:pt-5'
        },
        footer: {
            base: 'flex items-center gap-x-1.5 flex-shrink-0',
            padding: 'px-4 py-4 sm:px-6 sm:pt-0'
        },
    }">
        <UFormGroup class="w-full">
            <UInput placeholder="enter your database name" icon="solar:database-outline" />
        </UFormGroup>
        <template #title>
            Create your database
        </template>
        <template #footer>
            <UButton color="black" label="Create" :loading="loading" />
            <UButton color="gray" label="Cancel" @click="modal.close()" />
        </template>
    </UDashboardModal>
</template>

<script setup lang="ts">
const modal = useModal()
const loading = ref(false)
</script>
