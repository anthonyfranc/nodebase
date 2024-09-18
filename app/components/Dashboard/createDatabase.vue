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
        <UForm :validate="validate" :state="state" @submit="onSubmit">
            <UFormGroup class="w-full" name="databaseName">
                <UInput name="databaseName" v-model="state.databaseName" placeholder="enter your database name"
                    icon="solar:database-outline" tabindex="0" />
            </UFormGroup>
            <div class="px-0 pt-4 flex items-center gap-x-1.5 flex-shrink-0">
                <UButton type="submit" color="black" label="Create" :loading="loading" :disabled="!canSend" />
                <UButton color="gray" label="Cancel" @click="modal.close()" />
            </div>
        </UForm>
        <template #title>
            Create your database
        </template>
    </UDashboardModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const modal = useModal()
const loading = ref(false)
const emit = defineEmits<{
  (e: 'success'): void
}>()

const state = reactive({
    databaseName: ''
})

const canSend = computed(() => {
    return Boolean(
        state.databaseName
    )
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.databaseName) errors.push({ path: 'databaseName', message: '' })
    return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
    if (loading.value || !canSend.value) return

    loading.value = true
    try {
        const { error } = await supabase
            .from('user_databases')
            .insert({
                name: state.databaseName,
                user_id: user.value?.id,
                created_at: new Date()
            })
        if (error) {
            console.error("Error creating database");
            return
        }
        modal.close()
        emit('success')
    } catch (err) {
        console.error("Unexpected error:", err)
    }
    finally {
        loading.value = false
    }
}
</script>
