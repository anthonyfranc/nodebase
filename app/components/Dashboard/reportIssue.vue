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
    if (loading.value || !canSend.value) return;

    loading.value = true;
    try {
        // Insert issue into the `user_issues` table
        const { data: issueData, error: issueError } = await supabase
            .from('user_issues')
            .insert({
                user_email: user.value?.email,       // Get the user's email
                category: state.category,            // Selected category (Bug, Performance, etc.)
                description: state.description,      // Issue description
                created_at: new Date()               // Timestamp
            })
            .select();

        if (issueError) {
            toast.add({
                description: 'We\'re sorry, there was an error submitting your issue. Please try again later.',
                icon: 'i-heroicons-check-circle',
                color: 'red'
            });
            return;
        }

        // Insert notification with category context
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: user.value?.id,             // The ID of the user
                message: 'You reported an issue to us',  // Notification message
                type: 'new_issue',                   // Type of notification
                category: state.category,            // Store issue category in notification
                created_at: new Date()               // Timestamp
            });

        if (notificationError) {
            console.error("Error inserting notification:", notificationError);
        }

        modal.close();
        
    } catch (err) {
        console.error("Unexpected error:", err);
    } finally {
        loading.value = false;
    }
}
</script>