<template>
    <UDashboardPage>
      <UDashboardPanel>
        <UDashboardNavbar title="Home" />
  
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