<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <DashboardNotifications />
        </template>
      </UDashboardNavbar>

      <!-- Page content -->
      <UDashboardCard :ui="{ rounded: 'rounded-none' }">
        <template #description></template>
        <template #links>
          <UPopover>
            <UButton
              icon="material-symbols:responsive-layout-outline-rounded"
              label="Layout"
              color="gray"
              class="px-2 py-[5.8px] top-0 relative"
              :popper="{ placement: 'bottom-start' }"
            />
            <template #panel>
              <div class="overflow-hidden focus:outline-none bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg shadow-sm">
                <div class="px-2 pt-2 pb-2 border border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-2">{{ currentView }}
                    <!-- Card View Button -->
                    <button
                      class="relative flex flex-col items-center px-4 py-3 transition-colors duration-100 rounded shadow-sm ring-1 ring-inset focus:outline-none ring-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/25 dark:hover:bg-gray-700/50 u-text-gray-500 hover:u-text-gray-700"
                      :class="{ 'ring ring-gray-400': currentView.__name === 'homeCard' }"
                      @click="setView('card')"
                    >
                      <UIcon name="material-symbols:responsive-layout-outline-rounded" class="flex-shrink-0 w-5 h-5 mb-1" />
                      <span class="text-[12px] font-medium">Card</span>
                    </button>

                    <!-- Table View Button -->
                    <button
                      class="relative flex flex-col items-center px-4 py-3 transition-colors duration-100 rounded shadow-sm ring-1 ring-inset focus:outline-none ring-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/25 dark:hover:bg-gray-700/50 u-text-gray-500 hover:u-text-gray-700"
                      :class="{ 'ring-2 ring-blue-500': currentView.__name === 'homeTable' }"
                      @click="setView('table')"
                    >
                      <UIcon name="material-symbols:view-list-outline-rounded" class="flex-shrink-0 w-5 h-5 mb-1" />
                      <span class="text-[12px] font-medium">Table</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </UPopover>
          <UButton
            icon="mdi:database-plus-outline"
            label="Create Database"
            color="gray"
            @click="modal.open(LazyDashboardCreateDatabase)"
          />
        </template>
      </UDashboardCard>

      <!-- Conditional Rendering of Card or Table view -->
      <component v-bind:is="currentView" />
      
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { LazyDashboardCreateDatabase, DashboardHomeCard, DashboardHomeTable } from '#components';

const modal = useModal();

// State for tracking the current view
const currentView = shallowRef(DashboardHomeCard); // Default view is 'Card'

// Function to set the current view and save to local storage
const setView = (viewType) => {
  currentView.value = viewType === 'card' ? DashboardHomeCard : DashboardHomeTable;
  localStorage.setItem('userSelectedView', viewType); // Save the selected view to local storage
};

// Check local storage to see if a view has been previously selected
onMounted(() => {
  const savedView = localStorage.getItem('userSelectedView');
  if (savedView) {
    currentView.value = savedView === 'card' ? DashboardHomeCard : DashboardHomeTable;
  }
});

definePageMeta({
  layout: "dashboard",
});
</script>
