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
          <UButton color="white" variant="solid" :ui="{ rounded: 'rounded-full' }" @click="modal.open(LazyDashboardCreateDatabase)">Create
            Database</UButton>
        </div>
      </div>
    </UCard>

    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-4" v-else>
      <template v-for="database in userDatabasesStore.data" :key="database.id">
        <UDashboardCard :title="database.name">
          <template #links>
            <UDropdown :items="getDropdownItems(database.id)">
              <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
            </UDropdown>
          </template>
          <template #description>
            <div class="space-x-2 top-1 relative">
              <UBadge color="gray" variant="solid">Tables: {{ database.table_count || 0 }}</UBadge>
              <UBadge color="gray" variant="solid">Size: {{ database.total_size_kb || 0 }} KB</UBadge>
            </div>
          </template>
        </UDashboardCard>
      </template>
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
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