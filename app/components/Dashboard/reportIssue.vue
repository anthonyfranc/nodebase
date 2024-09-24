<template>
    <UDashboardModal :prevent-close="true" :closeButton="false">
        <template #title>
            Report an issue
        </template>
        <template #description>
            We're sorry you're having trouble. Please let us know what's going on and we'll work on improving your experience.
        </template>
        <UForm :validate="validate" :state="state" @submit="onSubmit">
            <UFormGroup class="w-full pb-2" name="issueSelect">
                <USelectMenu color="gray" variant="outline" v-model="state.category" :options="issueType" placeholder="Choose an issue category" tabindex="0"/>
            </UFormGroup>
            <UFormGroup class="w-full" name="description">
                <UTextarea color="gray" variant="outline" v-model="state.description" placeholder="Provide details on your selected issue or request" tabindex="0"/>
            </UFormGroup>
            <div class="px-0 pt-4 flex items-center gap-x-1.5 flex-shrink-0">
                <UButton type="submit" color="black" label="Submit" :loading="loading" :disabled="!canSend" />
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
const toast = useToast()
const mainStore = useMainStore()
const loading = ref(false)

const issueType = [
    'Bug',
    'Performance',
    'UI/UX',
    'Feature Request',
    'Security',
    'Something else'
]

const state = reactive({
    category: '',        // Holds the selected issue category
    description: ''      // Holds the issue description
})

const canSend = computed(() => {
    return Boolean(
        state.category && state.description
    )
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.category) errors.push({ path: 'category', message: 'Please select a category' })
    if (!state.description) errors.push({ path: 'description', message: 'Please provide a description' })
    return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
    if (loading.value || !canSend.value) return

    loading.value = true
    try {
        const { data: issueData, error: issueError } = await supabase
            .from('user_issues')   // Insert into the user_issues table
            .insert({
                user_email: user.value?.email,       // Get the user's email from the Supabase user object
                category: state.category,            // Category selected by the user
                description: state.description,      // Issue description
                created_at: new Date()               // Timestamp (can be omitted as it's set by default in SQL)
            })
            .select() // Include this to get the inserted issue data

        if (issueError) {
            toast.add({
                description: 'We\'re sorry, there was an error submitting your issue. Please try again later.',
                icon: 'i-heroicons-check-circle',
                color: 'red'
            })
            return
        }

        // Insert into notifications table with a default message
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: user.value?.id,             // The ID of the user submitting the issue
                message: 'We\'ve received your feedback',  // Default notification message
                type: 'new_issue',          // Store the ID of the issue (from the first insert)
                created_at: new Date()               // Timestamp (can be omitted if handled by default in SQL)
            })

        if (notificationError) {
            console.error("Error inserting notification:", notificationError);
        }

        modal.close()
        mainStore.setBoolean(true)
        toast.add({
            description: 'We\'ve received your concern. We\'ll get back to you soon.',
            icon: 'i-heroicons-check-circle',
            color: 'green'
        })
    } catch (err) {
        console.error("Unexpected error:", err)
    }
    finally {
        loading.value = false
    }
}
</script>