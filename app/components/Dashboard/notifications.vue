<template>
    <UPopover v-if="status === 'success'" ref="popoverRef" :key="`popover-${notifications.length}`" :popper="{ placement: 'bottom-start' }"
        :ui="{ width: 'w-5/6 sm:w-4/6 md:w-4/6 lg:w-2/6', shadow: '!shadow-sm' }">
        <template #default="{ open, close }">
            <UChip inset position="top-right" :color="unreadNotifications.length > 0 ? 'green' : 'gray'" class="mr-2"
                @click="handlePopoverToggle(open)">
                <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
            </UChip>
        </template>
        <template #panel>
            <div
                class="px-4 leading-6 border-b border-solid border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:bg-gray-800">
                <p class="pt-4 pb-1 m-0 text-sm leading-5 text-neutral-900 dark:text-gray-100">
                    Notifications
                </p>
                <div role="tablist"
                    class="flex flex-grow gap-5 items-center leading-6 border-b border-none text-neutral-900 dark:text-gray-300">
                    <button v-for="tab in tabs" :key="tab.name" type="button" role="tab"
                        :aria-selected="currentTab === tab.name" :class="[currentTab === tab.name ? 'border-b-2 border-neutral-900 dark:border-gray-300' : 'border-b-2 border-transparent']"
                        @click="currentTab = tab.name">
                        {{ tab.label }}
                        <UAvatar v-if="tab.name === 'inbox'" :alt="unreadNotifications.length.toString()" size="3xs"
                            class="-ml-1" :ui="{ background: 'bg-gray-100 dark:bg-gray-700' }" />
                    </button>
                </div>
            </div>
            <div class="dark:border-gray-700 text-neutral-500">
                <div v-if="currentNotifications.length === 0"
                    class="py-24 items-center justify-center flex flex-col flex-grow gap-y-4">
                    <UIcon name="i-heroicons-inbox" class="w-8 h-8" />
                    <p class="my-0 mx-auto w-56 text-xs leading-4 text-center text-gray-500">
                        {{ emptyStateMessage }}
                    </p>
                </div>
                <div v-else class="max-h-96 overflow-y-auto divide-y">
                    <div v-for="item in currentNotifications" :key="item.id"
                        class="flex gap-x-3 justify-between p-4 leading-6 dark:border-neutral-700 border-neutral-200 text-neutral-900 dark:text-neutral-300">
                        <div class="flex flex-col gap-y-2.5 py-px w-full">
                            <div class="flex items-center max-w-[350px]">
                                <span class="text-xs transition text-foreground-light hover:text-foreground truncate" v-show="item.type == 'new_issue'">
                                    Report an Issue / {{ item.category }}
                                </span>
                            </div>
                            <div class="flex gap-x-2 items-center">
                                <p class="m-0 text-sm leading-5">
                                    {{ getNotificationTitle(item) }}
                                    <span class="ml-1 text-xs leading-4 text-neutral-600">
                                        <UseTimeAgo v-slot="{ timeAgo }" :time="item.created_at">
                                            {{ timeAgo }}
                                        </UseTimeAgo>
                                    </span>
                                </p>
                            </div>
                            <p class="my-1 mx-0 max-w-prose text-xs leading-4 text-neutral-600 dark:text-neutral-400">
                                {{ getNotificationMessage(item) }}
                            </p>
                        </div>
                        <div class="flex flex-col items-center gap-y-2" v-show="currentTab === 'inbox'">
                            <UTooltip text="Mark as read" :popper="{ arrow: true }">
                                <UButton size="xs" color="gray" variant="solid"
                            icon="i-heroicons-archive-box" @click="archiveNotification(item.id)" :ui="{ rounded: 'rounded-full' }"/>
                            </UTooltip>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </UPopover>
    <UDropdown v-else text="Notifications" :shortcuts="['N']">
        <USkeleton class="h-7 w-7 border border-gray-200 dark:border-gray-800 mr-2" :ui="{ rounded: 'rounded-full' }" />
    </UDropdown>
</template>

<script setup lang="ts">
import { UseTimeAgo } from '@vueuse/components'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const mainStore = useMainStore()

const notifications = ref([])
const currentTab = ref('inbox')

const tabs = [
    { name: 'inbox', label: 'Inbox' },
    { name: 'archived', label: 'Archived' }
]

const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.is_read)
)

const currentNotifications = computed(() =>
    notifications.value.filter(n => currentTab.value === 'inbox' ? !n.is_read : n.is_read)
)

const emptyStateMessage = computed(() =>
    currentTab.value === 'inbox'
        ? "You're all caught up. Your unread notifications will appear here."
        : "No archived notifications."
)

const { status, execute: fetchNotifications } = await useAsyncData(
    'notifications',
    async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.value?.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching notifications:', error)
            return []
        }

        notifications.value = data
        return data
    },
    {
        server: false,
        immediate: false,
        lazy: true,
        watch: [mainStore]
    }
)

function getNotificationTitle(notification) {
    switch (notification.type) {
        case 'new_issue':
            return 'You reported an issue to us'
        // Add more cases for different notification types
        default:
            return 'New notification'
    }
}

function getNotificationMessage(notification) {
    switch (notification.message) {
        case 'We\'ve received your issue report':
            return 'We\'ve received your feedback and are currently working on it.'
        // Add more cases for different notification types
        default:
            return 'New notification'
    }
}

// Function to handle refreshing the notifications when popover opens
function handlePopoverToggle(open) {
    // Always fetch notifications when the popover is opened
    if (open) {
        fetchNotifications()
    }
}

async function archiveNotification(notificationId) {
    // Find the notification by id and mark it as read
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
        notification.is_read = true // Update the notification in place

        // Now update the database
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)

        if (error) {
            console.error('Error archiving notification:', error)
        }
    }
}

onMounted(() => {
    setTimeout(fetchNotifications, 1000)
})
</script>
