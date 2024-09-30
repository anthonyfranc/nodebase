<template>
    <UPopover v-if="notificationsStore.notifications.length > 0" ref="popoverRef"
        :key="`popover-${notificationsStore.notifications.length}`" :popper="{ placement: 'bottom-start' }"
        :ui="{ width: 'w-5/6 sm:w-4/6 md:w-4/6 lg:w-2/6', shadow: '!shadow-sm' }">
        <UChip inset position="top-right" :color="notificationsStore.unreadNotifications.length > 0 ? 'green' : 'gray'"
            class="mr-2">
            <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
        </UChip>
        <template #panel>
            <div
                class="px-4 leading-6 border-b border-solid border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:bg-gray-800">
                <p class="pt-4 pb-1 m-0 text-sm leading-5 text-neutral-900 dark:text-gray-100">
                    Notifications
                </p>
                <div role="tablist"
                    class="flex flex-grow gap-5 items-center leading-6 border-b border-none text-neutral-900 dark:text-gray-300">
                    <button v-for="tab in tabs" :key="tab.name" type="button" role="tab"
                        :aria-selected="currentTab === tab.name"
                        :class="[currentTab === tab.name ? 'border-b-2 border-neutral-900 dark:border-gray-300' : 'border-b-2 border-transparent']"
                        @click="currentTab = tab.name">
                        {{ tab.label }}
                        <UAvatar v-if="tab.name === 'inbox'"
                            :alt="notificationsStore.unreadNotifications.length.toString()" size="3xs" class="ml-0.5 -top-0.5"
                            :ui="{ background: 'bg-gray-100 dark:bg-gray-700' }" />
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
                                <span class="text-xs transition text-foreground-light hover:text-foreground truncate">
                                    <template v-if="item.type == 'new_issue'">
                                        <UBadge color="white" variant="solid" size="xs">Report an Issue <UIcon name="ph:dot-outline-fill" class="h-5 w-5"/>{{ item.category }}</UBadge>
                                    </template>
                                    <template v-if="item.type == 'new_database'">
                                        <UBadge color="white" variant="solid" size="xs">New Database <UIcon name="material-symbols-light:line-end-arrow-notch-rounded" class="h-5 w-8"/>{{ item.category }}</UBadge>
                                    </template>
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
                                <UButton size="xs" color="gray" variant="solid" icon="i-heroicons-archive-box"
                                    @click="archiveNotification(item.id)" :ui="{ rounded: 'rounded-full' }" />
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

const user = useSupabaseUser()
const notificationsStore = useNotificationsStore()
const currentTab = ref('inbox')

const tabs = [
    { name: 'inbox', label: 'Inbox' },
    { name: 'archived', label: 'Archived' },
]

// Computed property for current notifications based on the selected tab
interface Notification {
    id: string;
    type: string;
    category: string;
    created_at: string;
    message: string;
}

const currentNotifications = computed<Notification[]>(() => {
    return currentTab.value === 'inbox'
        ? notificationsStore.unreadNotifications
        : notificationsStore.readNotifications
})

const emptyStateMessage = computed(() =>
    currentTab.value === 'inbox'
        ? "You're all caught up. Your unread notifications will appear here."
        : 'No archived notifications.'
)

// Fetch notifications when the component is mounted
onMounted(() => {
    if (user.value) {
        notificationsStore.fetchNotifications(user.value.id)
        notificationsStore.subscribeToNotifications(user.value.id)
    }
})


// Map functions for notification titles and messages
function getNotificationTitle(notification) {
    switch (notification.type) {
        case 'new_issue':
            return 'You reported an issue to us'
        case 'new_database':
            return 'You created a new database'
    }
}

function getNotificationMessage(notification) {
    switch (notification.message) {
        case "We've received your issue report":
            return "We've received your feedback and are currently working on it."
        // Add more cases as needed
        default:
            return ''
    }
}

// Archive a notification
async function archiveNotification(notificationId) {
    await notificationsStore.archiveNotification(notificationId)
}
</script>
