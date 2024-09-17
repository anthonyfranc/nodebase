<script setup lang="ts">
const { data: page } = await useAsyncData('page', () => queryContent('/dashboard').findOne())
const { profile, email, user_id, refreshUserProfile } = await useUserProfile()
const { USER_KEY } = await USER_PROFILE_KEY()
provide(USER_KEY, { profile, email, user_id, refreshUserProfile })

useDashboard()

const groups = [{
    key: 'links',
    label: 'Go to',
    commands: page.value.links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'company',
  label: 'Company',
  commands: [{
    id: 'source',
    label: 'Product Updates',
    icon: 'solar:bolt-bold-duotone',
    to: '/dashboard/updates'
  }]
}]
</script>

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
                <UDashboardSidebarLinks :links="page.links" />
                <template #footer>
                    <DashboardUserDropdown />
                </template>
            </UDashboardSidebar>
        </UDashboardPanel>
        <slot />
        <ClientOnly>
            <LazyUDashboardSearch :groups="groups"/>
        </ClientOnly>
    </UDashboardLayout>
</template>