<template>
    <UDashboardPage>
      <UDashboardPanel :width="300" :resizable="{ min: 200, max: 400 }">
        <UDashboardNavbar title="Tables" :ui="{
            wrapper: 'h-10 flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0',
        }"/>
  
        <UDashboardPanelContent>
          <UDashboardCard />
  
          <div class="grid lg:grid-cols-2 gap-4 mt-4">
            <UDashboardCard />
            <UDashboardCard />
          </div>
        </UDashboardPanelContent>
      </UDashboardPanel>
    </UDashboardPage>
  </template>

<script setup lang="ts">

definePageMeta({
  layout: "dashboard",
});
</script>