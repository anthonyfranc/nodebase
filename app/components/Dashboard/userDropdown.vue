<script setup lang="ts">
import { LazyDashboardReportIssue } from '#components';
const { USER_KEY } = await USER_PROFILE_KEY()
const userProfile = inject(USER_KEY) as { profile: { first_name: string; last_name: string; }, email: string }

const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()
const modal = useModal()

const items = computed(() => [
    [{
        slot: 'account',
        label: '',
        disabled: true
    }],
    [{
        label: 'Report an issue',
        icon: 'i-heroicons-question-mark-circle',
        click: () => {
              modal.open(LazyDashboardReportIssue)
        }
    },
    {
        label: 'Command menu',
        icon: 'i-heroicons-command-line',
        shortcuts: [metaSymbol.value, 'K'],
        click: () => {
            isDashboardSearchModalOpen.value = true
        }
    }],
    [{
        label: 'Sign out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: () => logout()
    }]
])

async function logout() {
    const supabase = useSupabaseClient()
    const toast = useToast()
    try {
        const { error } = await supabase.auth.signOut();
        navigateTo('/dashboard/login');
        if (error) {
            toast.add({
                title: 'Notification',
                description: 'Sorry we were unable to log you out, please try again.',
                color: 'red'
            })
            navigateTo('/dashboard/')
        } else {
            toast.add({
                title: 'Notification',
                description: 'You have been logged out.',
                color: 'green'
            })
            // Successful logout, navigate to the login page
            navigateTo('/login');
        }
    } catch (error) {
        // Handle any unexpected errors here
        toast.add({
            title: 'Notification',
            description: 'Sorry we were unable to log you out, please try again.',
            color: 'red'
        })
        navigateTo('/dashboard/')
    }
}
</script>

<template>
    <UDropdown mode="hover" :items="items" :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
        :popper="{ strategy: 'absolute', placement: 'top' }" class="w-full">
        <template #default="{ open }">
            <UButton color="gray" variant="ghost" class="w-full" :label="userProfile.profile.first_name"
                :class="[open && 'bg-gray-50 dark:bg-gray-800']">
                <template #leading>
                    <UAvatar :alt="userProfile.profile.first_name + ' ' + userProfile.profile.last_name" size="2xs" />
                </template>

                <template #trailing>
                    <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
                </template>
            </UButton>
        </template>

        <template #account>
            <div class="text-left truncate">
                <p>
                    Signed in as
                </p>
                <p class="truncate font-medium text-gray-900 dark:text-white w-auto">
                    {{ userProfile.email }}
                </p>
            </div>
        </template>
        <template #logout>

        </template>
    </UDropdown>
</template>