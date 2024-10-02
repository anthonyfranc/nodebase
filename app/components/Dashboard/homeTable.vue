<template>
    <!-- Loading Skeletons -->
    <UDashboardPanelContent v-if="userDatabasesStore.isLoading !== 'success'">
        <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
            <UDashboardCard v-for="index in 6" :key="index"
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
        <UCard class="flex items-center justify-center" v-if="userDatabasesStore.data.length < 1">
            <div class="text-center ">
                <UIcon name="solar:database-outline" class="mx-auto mb-2 w-5 h-5" />
                <p class="mt-1 text-gray-500 dark:text-gray-400 text-sm">You don't have any databases.</p>
                <div class="mt-4">
                    <UButton color="white" variant="solid" :ui="{ rounded: 'rounded-full' }"
                        @click="modal.open(LazyDashboardCreateDatabase)">Create
                        Database</UButton>
                </div>
            </div>
        </UCard>
        <div v-else class="-p-2 -m-4">
            <UTable sort-asc-icon="i-heroicons-arrow-up-20-solid" sort-desc-icon="i-heroicons-arrow-down-20-solid"
                :sort-button="{ icon: 'i-heroicons-sparkles-20-solid', color: 'primary', variant: 'outline', size: '2xs', square: false, ui: { rounded: 'rounded-full' } }"
                :rows="userDatabasesStore.data" :columns="[{
                    key: 'name',
                    label: 'Database',
                    sortable: true
                }, {
                    key: 'table_count',
                    label: 'Table Count',
                    sortable: true
                }, {
                    key: 'total_size_kb',
                    label: 'Total Size (KB)',
                    sortable: true
                }, {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true
                }, {
                    key: 'action'
                }]
                    ">
                <template #created_at-data="{ row }">
                    <UseTimeAgo v-slot="{ timeAgo }" :time="row.created_at">
                        {{ timeAgo }}
                    </UseTimeAgo>
                </template>
                <template #action-data="{ row }">
                    <UDropdown :items="getDropdownItems(row.id)">
                        <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
                    </UDropdown>
                </template>
            </UTable>
        </div>
    </UDashboardPanelContent>
</template>

<script setup lang="ts">
import { UseTimeAgo } from '@vueuse/components'
import { LazyDashboardDeleteDatabase, LazyDashboardCreateDatabase } from '#components';

const userDatabasesStore = useUserDatabasesStore()
const modal = useModal()
useDashboard()

const getDropdownItems = (databaseId) => [
    [
        {
            label: 'Manage',
            icon: 'heroicons:arrow-right-circle',
            click: () => {
                navigateTo(`/dashboard/database/${databaseId}`);
            },
        },
        {
            label: 'Delete Database',
            icon: 'heroicons:trash',
            click: () => {
                modal.open(LazyDashboardDeleteDatabase, {
                    data: databaseId,
                });
            },
        },
    ]
];
</script>