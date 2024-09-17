<template>
    <!-- Loading Skeletons -->
    <UDashboardPanelContent v-if="status !== 'success'">
        <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
            <UDashboardCard v-for="n in 6" :key="n"
                :links="[{ label: 'Manage', color: 'gray', trailingIcon: 'i-heroicons-arrow-right-20-solid' }]">
                <template #title>
                    <USkeleton class="h-4 mt-2.5 w-[100px]" />
                </template>
                <template #description>
                    <USkeleton class="h-4 mt-2.5 w-[170px]" />
                </template>
                <template #links>
                    <USkeleton class="h-7 w-[85px]" />
                </template>
            </UDashboardCard>
        </div>
    </UDashboardPanelContent>

    <!-- Actual Data Rendering -->
    <UDashboardPanelContent v-else>
        <UCard class="flex items-center justify-center" v-if="userDatabases.length < 1">
            <div class="text-center ">
                <UIcon name="solar:database-outline" class="mx-auto mb-2 w-5 h-5" />
                <p class="mt-1 text-gray-500 dark:text-gray-400 text-sm">You don't have any databases.</p>
                <div class="mt-4">
                    <UButton color="white" variant="solid" :ui="{ rounded: 'rounded-full' }">Create Database</UButton>
                </div>
            </div>
        </UCard>

        <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-4" v-else>
            <template v-for="database in userDatabases" :key="database.id">
                <UDashboardCard :title="database.name">
                    <template #links>
                        <UDropdown :items="dropdownItems">
                            <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
                        </UDropdown>
                    </template>
                    <template #description>
                        <div class="space-x-2 top-1 relative">
                            <UBadge color="gray" variant="solid">Tables: {{ database.tableCount || 0 }}</UBadge>
                            <UBadge color="gray" variant="solid">Size: {{ database.totalSize || 0 }} kb</UBadge>
                        </div>
                    </template>
                </UDashboardCard>
            </template>
        </div>
    </UDashboardPanelContent>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userDatabases = ref([]);
const toast = useToast();

definePageMeta({
    layout: "dashboard",
});

const dropdownItems = [[{
    label: 'Mark as unread',
    icon: 'i-heroicons-check-circle'
}, {
    label: 'Mark as important',
    icon: 'i-heroicons-exclamation-circle'
}], [{
    label: 'Star thread',
    icon: 'i-heroicons-star'
}, {
    label: 'Mute thread',
    icon: 'i-heroicons-pause-circle'
}]]

// Fetch database metadata using useAsyncData
const { status, execute: databaseExecute } = await useAsyncData(
    "database",
    async () => {
        const { data: databases, error } = await supabase
            .from("user_databases")
            .select("*")
            .eq("user_id", user.value.id);

        if (error) {
            toast.add({
                title: "Error",
                description: error.message,
                color: "red",
                icon: "i-heroicons-x-mark-20-solid",
            });
            return;
        }

        if (databases) {
            // Enrich each database with the tableCount and totalSize
            const databaseWithMetadata = await Promise.all(
                databases.map(async (database) => {
                    // Get table count for the specific database
                    const { data: tableCountData, error: tableCountError } = await supabase.rpc('count_user_tables', {
                        user_id: user.value.id,
                    });

                    if (tableCountError) {
                        console.error("Error fetching table count:", tableCountError);
                    }

                    const tableCount = tableCountData ? tableCountData[0].count : 0;

                    // Get total size for the specific database
                    const { data: sizeData, error: sizeError } = await supabase.rpc('get_user_tables_size', {
                        user_id: user.value.id,
                    });

                    if (sizeError) {
                        console.error("Error fetching database size:", sizeError);
                    }

                    const totalSize = sizeData ? sizeData[0].size_kb : 0;

                    // Add the tableCount and totalSize to the database object
                    return {
                        ...database,
                        tableCount,  // Add table count
                        totalSize,   // Add total size
                    };
                })
            );

            userDatabases.value = databaseWithMetadata;
        }
    },
    {
        server: true,
        lazy: true,
        immediate: false,
    }
);

// Execute the function after the component is mounted
onMounted(async () => {
    await databaseExecute();
});
</script>