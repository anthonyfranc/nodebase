<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <DashboardNotifications />
        </template>
      </UDashboardNavbar>

      <!-- Page content -->
      <UDashboardCard :ui="{ rounded: 'rounded-none' }" 
         :links="[
          {
            label: 'Create Database',
            color: 'gray',
            icon: 'mdi:database-plus-outline',
            click: () => {
              modal.open(LazyDashboardCreateDatabase)
            }
          }
        ]">
        <template #description>

        </template>
      </UDashboardCard>
    <DashboardHome :success="true"/>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { LazyDashboardCreateDatabase } from '#components';

const modal = useModal()

definePageMeta({
  layout: "dashboard",
});
</script>