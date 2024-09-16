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
      </UDashboardPanel>
  </UDashboardPage>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: "dashboard",
  });
  </script>