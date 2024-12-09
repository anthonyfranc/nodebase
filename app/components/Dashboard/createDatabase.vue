<template>
    <UDashboardModal :prevent-close="true" :closeButton="false" :ui="{
        header: {
            base: '',
            inner: '',
            padding: 'px-4 mt-0.5 sm:px-6'
        },
        body: {
            base: 'flex-1 flex flex-col gap-y-3 overflow-y-auto',
            padding: 'px-4 py-5 sm:pt-2'
        },
        footer: {
            base: 'flex items-center gap-x-1.5 flex-shrink-0',
            padding: 'px-4 py-4 sm:px-6 sm:pt-0'
        },
    }">
        <UForm :validate="validate" :state="state" @submit="onSubmit">
            <UFormGroup class="w-full" name="databaseName">
                <UInput color="gray" variant="outline" name="databaseName" v-model="state.databaseName"
                    placeholder="enter your database name" icon="solar:database-outline" tabindex="0" />
            </UFormGroup>
            <div class="px-0 pt-4 flex items-center gap-x-1.5 flex-shrink-0">
                <UButton type="submit" color="black" label="Create" :loading="loading" :disabled="!canSend" />
                <UButton color="gray" label="Cancel" @click="modal.close()" />
            </div>
        </UForm>
        <template #title>
            Create your Database
        </template>
    </UDashboardModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const modal = useModal()
const loading = ref(false)
const mainStore = useMainStore()

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
        // Insert notification with category context
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: user.value?.id,             // The ID of the user
                message: `You've created a new databased named `+state.databaseName,  // Notification message
                type: 'new_database',                   // Type of notification
                category: state.databaseName,            // Store issue category in notification
                created_at: new Date()               // Timestamp
            });
        if (notificationError) {
            console.error("Error inserting notification:", notificationError);
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
