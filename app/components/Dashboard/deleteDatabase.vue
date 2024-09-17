<template>
    <UDashboardModal v-model="open" :prevent-close="true" title="Delete database" :closeButton="false">
        <template #description>
            Are you sure you want to delete this database? This action will remove all tables, rows and columns from the
            database.
        </template>
        <template #footer>
            <UButton color="red" label="Delete" :loading="loading" @click="deleteDatabase" />
            <UButton color="white" label="Cancel" @click="modal.close()" />
        </template>
    </UDashboardModal>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const open = ref(true)
const loading = ref(false)
const modal = useModal()
const { data } = defineProps(['data']);
const emit = defineEmits(['success'])

const deleteDatabase = async () => {
    loading.value = true;

    try {
        // Just delete the database, cascading deletes will take care of the related tables and rows
        const { error } = await supabase
            .from('user_databases')
            .delete()
            .eq('id', data);

        if (error) {
            console.log('Error deleting database:', error);
            return;
        }

        // Close modal on success
        modal.close();
        emit('success')
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        loading.value = false;
    }
};

</script>