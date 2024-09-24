<template>
    <template v-if="status != 'success'">
        <UDropdown text="Notifications" :shortcuts="['N']">
            <USkeleton class="h-7 w-7 border border-gray-200 dark:border-gray-800 mr-2"
                :ui="{ rounded: 'rounded-full' }" />
        </UDropdown>
    </template>
    <template v-else>
        <UPopover :popper="{ placement: 'bottom-start' }"
            :ui="{ width: 'w-5/6 sm:w-4/6 md:w-4/6 lg:w-2/6', shadow: '!shadow-sm' }">
            <UChip inset position="top-right" :color="notifications.length > 0 ? 'green' : 'gray'" class="mr-2">
                <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
            </UChip>
            <template #panel>
                <div
                    class="px-4 leading-6 border-b border-solid border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:bg-gray-800">
                    <p
                        class="pt-4 pb-1 m-0 text-sm leading-5 border-0 border-solid border-neutral-200 text-neutral-900 dark:text-gray-100">
                        Notifications
                    </p>
                    <div role="tablist"
                        class="flex flex-grow gap-5 items-center leading-6 border-t-0 border-b border-none border-x-0 border-neutral-200 text-neutral-900 dark:text-gray-300"
                        tabindex="0">
                        <button type="button" role="tab" aria-selected="true"
                            class="flex gap-2 justify-center items-center py-1 px-0 m-0 text-sm leading-5 text-center normal-case whitespace-nowrap bg-transparent bg-none border-t-0 border-b-2 border-solid transition-all cursor-pointer border-x-0 border-neutral-900 dark:border-gray-300 text-neutral-900 dark:text-gray-300"
                            tabindex="0">
                            Inbox
                            <UAvatar :alt="notifications.length.toString()" size="3xs" class="-ml-1" :ui="{
                                background: 'bg-gray-100 dark:bg-gray-700'
                            }" />
                        </button>
                        <button type="button" role="tab"
                            class="flex gap-2 justify-center items-center py-1 px-0 m-0 text-sm leading-5 text-center normal-case whitespace-nowrap bg-transparent bg-none border-t-0 border-b-0 border-solid transition-all cursor-pointer border-x-0 border-neutral-900 dark:border-gray-300 text-neutral-900 dark:text-gray-300"
                            tabindex="1">
                            Archived
                        </button>
                    </div>
                </div>
                <div class="dark:border-gray-700 text-neutral-500">
                    <div class="py-24 items-center justify-center flex flex-col flex-grow gap-y-4"
                        v-if="notifications.length < 1">
                        <UIcon name="i-heroicons-inbox" class="w-8 h-8" />
                        <div class="flex flex-col gap-y-1 border-0 border-solid border-neutral-200">
                            <p
                                class="my-0 mx-auto w-56 text-xs leading-4 text-center border-0 border-solid border-gray-200 text-gray-500">
                                You're all caught up. Your unread notification will appear here.
                            </p>
                        </div>
                    </div>
                    <div class="max-h-96 overflow-y-auto divide-y" v-else>
                        <div class="flex gap-x-3 justify-between p-4 leading-6 dark:border-neutral-700 border-neutral-200 text-neutral-900 dark:text-neutral-300"
                            v-for="(item, index) in notifications">
                            <div class="flex flex-col gap-y-2.5 py-px w-full border-0 border-solid border-neutral-200">
                                <div class="flex gap-x-2 items-center border-0 border-solid border-neutral-200">
                                    <p class="m-0 text-sm leading-5 border-0 border-solid border-neutral-200">
                                        <template v-if="notifications[0].type == 'new_issue'">
                                            You reported an issue to us
                                        </template>
                                        <span
                                            class="ml-1 text-xs leading-4 border-0 border-solid border-neutral-200 text-neutral-600">
                                            <UseTimeAgo v-slot="{ timeAgo }" :time="item.created_at">
                                                {{ timeAgo }}
                                            </UseTimeAgo>
                                        </span>
                                    </p>
                                </div>
                                <div
                                    class="max-w-prose text-xs leading-4 border-0 border-solid border-neutral-200 text-neutral-600 dark:text-neutral-400">
                                    <p class="my-1 mx-0">
                                        We received your issue report, we're currently reviewing and will respond shortly.
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-y-2 items-center border-0 border-solid border-neutral-200">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
    </template>
</template>

<script setup lang="ts">
import { UseTimeAgo } from '@vueuse/components'
const supabase = useSupabaseClient();
const user = useSupabaseUser()
const mainStore = useMainStore();
const notifications = ref([]);
const groupedItems = ref([]);  // This will hold the grouped items for the dropdown

// Fetch unread notifications for the current user
const { status, execute: fetchNotifications } = await useAsyncData(
    'notifications', async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.value?.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        notifications.value = data;

        // Group the notifications into an array of arrays for the dropdown
        groupedItems.value = [
            [{
                label: user.value?.email || 'ben@example.com',  // Show user's email
                slot: 'account',
                disabled: true
            }],
            data.map(notification => ({
                label: notification.message,  // Notification message as label
                icon: 'i-heroicons-bell',     // Example icon, can be dynamic
                notificationId: notification.id // For marking as read
            }))
        ];

        return groupedItems.value;
    }, {
    server: false,
    immediate: false,
    lazy: true,
    watch: [mainStore]
}
);

// Mark a notification as read
async function markAsRead(notificationId) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
    } else {
        // Fetch updated notifications
        fetchNotifications();
    }
}

// Fetch notifications when the component is mounted
onMounted(async () => {
    setTimeout(async () => {
        await fetchNotifications();
    }, 1000);
})
</script>