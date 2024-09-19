<template>
    <UDashboardLayout>
        <UDashboardPanel :width="225" collapsible>
            <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
                <template #left>
                    <AppLogo class="w-auto pt-1.5 lg:h-6 lg:pt-0" />
                </template>
            </UDashboardNavbar>
            <UDashboardSidebar>
                <template #header>
                    <UDashboardSearchButton />
                </template>

                <!-- Modify the array for UDashboardSidebarLinks -->
                <UDashboardSidebarLinks :links="sidebarLinks">
                    <template #default="{ link }">
                        <div v-if="userDatabasesStore.isLoading != 'success' && link.label != 'Home'">
                            <USkeleton class="h-4 w-[125px]" />
                        </div>
                    </template>
                    <template #icon="{ link }">
                        <div v-if="userDatabasesStore.isLoading != 'success' && link.label != 'Home'">
                            <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
                        </div>
                    </template>
                </UDashboardSidebarLinks>

                <template #footer>
                    <DashboardUserDropdown />
                </template>
            </UDashboardSidebar>
        </UDashboardPanel>

        <slot />

        <ClientOnly>
            <LazyUDashboardSearch :groups="groups" />
        </ClientOnly>
    </UDashboardLayout>
</template>


<script setup lang="ts">
import { DashboardCreateDatabase } from '#components';
const { profile, email, user_id, refreshUserProfile } = await useUserProfile()
const { USER_KEY } = await USER_PROFILE_KEY()
provide(USER_KEY, { profile, email, user_id, refreshUserProfile })

const userDatabasesStore = useUserDatabasesStore()
const mainStore = useMainStore()
const modal = useModal()
useDashboard()

onMounted(() => {
  userDatabasesStore.fetchUserDatabases(profile.id)
})

watch(mainStore, () => {
  userDatabasesStore.fetchUserDatabases(profile.id)
})

const databaseLinks = computed(() => {
  if (userDatabasesStore.isLoading === 'success') {
    return [
      // Map the fetched databases to link objects
      ...userDatabasesStore.data.map((db) => ({
        label: db.name,
        to: '',
        chip: 'green',
      })),
      // Add the "Create Database" entry
      {
        label: 'Create Database',
        click: () => {
          modal.open(DashboardCreateDatabase);
        },
        chip: 'green',
        icon: 'mdi:plus',
      },
    ];
  } else {
    // Return default placeholder before data is loaded
    return [
      {
        label: 'Loading...',
        to: '',
        chip: 'grey',
        icon: 'mdi:loading',
      },
    ];
  }
});

// Create a parent "Databases" link with children
const sidebarLinks = computed(() => [
    {
        label: 'Home',
        icon: 'mdi:home-variant-outline',
        to: '/dashboard',
    },
    {
        label: 'Database',
        icon: 'mdi:database-outline',
        children: databaseLinks.value,
    },
]);

const groups = computed(() => [
  {
    key: 'links',
    label: 'Go to',
    commands: sidebarLinks.value.map((link) => ({ ...link })),
  },
  {
    key: 'databases',
    label: 'Databases',
    commands: databaseLinks.value,
  },
]);
</script>