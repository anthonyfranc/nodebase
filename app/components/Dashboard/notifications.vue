<template>
    <template v-if="status != 'success'">
        <UDropdown text="Notifications" :shortcuts="['N']">
            <USkeleton class="h-7 w-7 border border-gray-200 dark:border-gray-800 mr-2"
                :ui="{ rounded: 'rounded-full' }" />
        </UDropdown>
    </template>
    <template v-else>
        <UPopover :popper="{ placement: 'bottom-start'}" :ui="{ width: 'w-5/6 sm:w-4/6 md:w-4/6 lg:w-2/6', shadow: '!shadow-sm' }">
            <UChip inset position="top-right" :color="notifications.length > 0 ? 'green' : 'gray'" class="mr-2">
                <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
            </UChip>
            <template #panel>
                <div class="px-4 leading-6 border-b border-solid border-neutral-200 text-neutral-900 dark:bg-gray-800">
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
                            <UAvatar :alt="notifications.length.toString()" size="3xs" class="-ml-1" />
                        </button>
                    </div>
                </div>
                <div class="border-solid dark:border-gray-700 text-neutral-500">
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
                                        Migration to v2 platform architecture
                                        <span
                                            class="ml-1 text-xs leading-4 border-0 border-solid border-neutral-200 text-neutral-600">Jun
                                            17, 2024</span>
                                    </p>
                                </div>
                                <div
                                    class="max-w-prose text-xs leading-4 border-0 border-solid border-neutral-200 text-neutral-600">
                                    <p class="my-5 mx-0 font-normal border-0 border-solid border-neutral-200">
                                        Your project has been scheduled for automatic migration during this
                                        maintenance window: 2024-06-26 02:30 to 02:59 UTC, with up to a few
                                        minutes downtime.
                                    </p>
                                </div>
                                <div class="flex gap-x-2 items-center border-0 border-solid border-neutral-200">
                                    <a target="_blank" rel="noreferrer" data-size="tiny" type="button"
                                        class="inline-flex relative justify-center items-center py-1 px-2 h-6 text-xs leading-4 text-center bg-white bg-none rounded-md border border-solid duration-200 ease-out cursor-pointer border-neutral-300 outline-0 outline-offset-2"
                                        href="/dashboard/project/jjtqvxvprcmblezstaks/settings/general"
                                        style="text-decoration: none; outline: transparent solid 2px; transition-property: all; animation-duration: 0.2s; animation-timing-function: cubic-bezier(0, 0, 0.2, 1);">
                                        <div class="border-0 border-solid border-neutral-200 text-neutral-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="block w-3 h-3 align-middle border-0 border-solid border-neutral-200">
                                                <path d="M15 3h6v6" class="border-0 border-solid border-neutral-200">
                                                </path>
                                                <path d="M10 14 21 3" class="border-0 border-solid border-neutral-200">
                                                </path>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                                    class="border-0 border-solid border-neutral-200"></path>
                                            </svg>
                                        </div>
                                        <span class="mr-0 ml-2 border-0 border-solid truncate border-neutral-200">Manual
                                            Migration</span>
                                    </a>
                                </div>
                            </div>
                            <div class="flex flex-col gap-y-2 items-center border-0 border-solid border-neutral-200">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                    class="block p-px w-5 h-5 align-middle bg-amber-600 rounded border-0 border-solid border-neutral-200 text-stone-50">
                                    <path fill-rule="evenodd"
                                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                        clip-rule="evenodd" class="border-0 border-solid border-neutral-200"></path>
                                </svg><button data-size="tiny" type="button"
                                    class="inline-flex relative justify-center items-center p-1 m-0 h-6 text-xs leading-4 text-center normal-case bg-transparent bg-none rounded-full border border-solid opacity-0 duration-200 ease-out cursor-pointer border-neutral-300 outline-0 outline-offset-2"
                                    data-state="closed"
                                    style="outline: transparent solid 2px; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter; animation-duration: 0.2s; animation-timing-function: cubic-bezier(0, 0, 0.2, 1);">
                                    <div class="border-0 border-solid border-neutral-200 text-neutral-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="block w-3 h-3 align-middle border-0 border-solid border-neutral-200 text-neutral-600">
                                            <rect width="20" height="5" x="2" y="3" rx="1"
                                                class="border-0 border-solid border-neutral-200"></rect>
                                            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"
                                                class="border-0 border-solid border-neutral-200"></path>
                                            <path d="M10 12h4" class="border-0 border-solid border-neutral-200"></path>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
    </template>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser()
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
    lazy: true
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