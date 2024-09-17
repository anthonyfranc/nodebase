<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="gray" variant="ghost">
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <!-- Page content -->
      <UDashboardCard :ui="{ rounded: 'rounded-none' }" 
        description="Welcome to beta access. Please report any issues you encounter." :links="[
          {
            label: 'Report an issue',
            color: 'gray',
            trailingIcon: 'i-heroicons-arrow-right-20-solid'
          }
        ]" />
    <DashboardHome />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>