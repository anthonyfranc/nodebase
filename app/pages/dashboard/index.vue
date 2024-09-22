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
        description="Welcome to beta access. Please report any issues you encounter." :links="[
          {
            label: 'Report an issue',
            color: 'gray',
            click: () => {
              modal.open(LazyDashboardReportIssue)
            }
          },
          {
            label: 'Create Database',
            color: 'gray',
            icon: 'mdi:database-plus-outline',
            click: () => {
              modal.open(LazyDashboardCreateDatabase)
            }
          }
        ]" />
    <DashboardHome :success="true"/>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { LazyDashboardCreateDatabase, LazyDashboardReportIssue } from '#components';

const modal = useModal()

definePageMeta({
  layout: "dashboard",
});
</script>