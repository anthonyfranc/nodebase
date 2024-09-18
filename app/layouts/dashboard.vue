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
                        <div v-if="status != 'success'">
                            <USkeleton class="h-4 w-[125px]" />
                        </div>
                    </template>
                    <template #icon>
                        <div v-if="status != 'success'">
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
const { data: page } = await useAsyncData('page', () => queryContent('/dashboard').findOne())
const { profile, email, user_id, refreshUserProfile } = await useUserProfile()
const { USER_KEY } = await USER_PROFILE_KEY()
provide(USER_KEY, { profile, email, user_id, refreshUserProfile })

useDashboard()
const modal = useModal()
const mainStore = useMainStore()
const database = ref([])
const isLoading = ref(true); // Loading state

// Fetch user's databases from Supabase
const supabase = useSupabaseClient()

const { status, execute: dataExecute } = await useAsyncData(
    'data',
    async () => {
        const { data, error } = await supabase
            .from('user_databases')
            .select('id, name')
            .eq('user_id', profile.id);

        if (!error) {
            database.value = data;
        }
        isLoading.value = false; // Stop loading once data is fetched
    },
    {
        server: false,
        lazy: false,
        immediate: false,
        watch: [mainStore],
    }
);

// Create a submenu for the "Databases" section
const databaseLinks = ref([]) // Use ref to reactively update links

watchEffect(() => {
    // Update databaseLinks when data is fetched
    if (status) {
        databaseLinks.value = database.value.map((db) => ({
            label: db.name,
            to: '',
            chip: 'green',
        }));

        // Add the "Create Database" entry
        databaseLinks.value.push({
            label: 'Create Database',
            click: () => {
                modal.open(DashboardCreateDatabase);
            },
            chip: 'green',
            icon: 'mdi:plus',
        });
    }
});

// Create a parent "Databases" link with children
const sidebarLinks = computed(() => [
    ...page.value.links,
    {
        label: 'Database',
        icon: 'mdi:database-outline',
        children: databaseLinks.value  // Reactively use databaseLinks
    }
])

const groups = [
    {
        key: 'links',
        label: 'Go to',
        commands: page.value.links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
    },
    {
        key: 'databases',
        label: 'Databases',  // Create a new "Database" menu
        commands: databaseLinks.value,  // Add the fetched databases as commands
    },
]

onMounted(async () => {
    await dataExecute();
});
</script>