<template>
    <UDashboardModal :prevent-close="true" :closeButton="false">
        <template #title>
            Report an issue
        </template>
        <template #description>
            We're sorry you're having trouble. Please let us know what's going on and we'll work improving your experience.
        </template>
        <UForm :validate="validate" :state="state" @submit="onSubmit">
            <UFormGroup class="w-full pb-2" name="issueSelect">
                <USelectMenu color="gray" variant="outline" v-model="selected" :options="issueType" placeholder="Choose an issue category" tabindex="0"/>
            </UFormGroup>
            <UFormGroup class="w-full" name="databaseName">
                <UTextarea color="gray" variant="outline" placeholder="Provide details on your selected issue or request" tabindex="0"/>
            </UFormGroup>
            <div class="px-0 pt-4 flex items-center gap-x-1.5 flex-shrink-0">
                <UButton type="submit" color="black" label="Create" :loading="loading" :disabled="!canSend" />
                <UButton color="gray" label="Cancel" @click="modal.close()" />
            </div>
        </UForm>
    </UDashboardModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'


const supabase = useSupabaseClient()
const user = useSupabaseUser()
const modal = useModal()
const loading = ref(false)
const mainStore = useMainStore()

const issueType = [
    'Bug',
    'Performance',
    'UI/UX',
    'Feature Request',
    'Security',
    'Something else'
]

const selected = ref([])

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
        mainStore.setBoolean(true)
    } catch (err) {
        console.error("Unexpected error:", err)
    }
    finally {
        loading.value = false
    }
}
</script>