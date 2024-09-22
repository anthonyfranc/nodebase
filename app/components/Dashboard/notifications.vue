<template>
    <template v-if="notifications.length === 0">
        <UDropdown text="Notifications" :shortcuts="['N']">
            <USkeleton class="h-7 w-7 border border-gray-200 dark:border-gray-800 mr-2"
                :ui="{ rounded: 'rounded-full' }" />
        </UDropdown>
    </template>
    <template v-else>
        <UTooltip text="Notifications" :shortcuts="['N']">
            <UPopover @click="refreshNotifications">
                <UChip inset position="top-right" :color="notifications.length > 0 ? 'green' : 'gray'" class="mr-2">
                    <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
                </UChip>
                <template #panel>
                    <div
                        class="w-3xl relative focus:outline-none overflow-y-auto scroll-py-1 divide-y divide-gray-100 dark:divide-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 rounded-md shadow-lg bg-white dark:bg-gray-800">
                        <div class="p-1">
                            <span
                                class="group flex items-center gap-1.5 w-full px-1.5 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200 cursor-default opacity-50">
                                <div class="text-left">
                                    <p>Notifications</p>
                                </div>
                            </span>
                            <div class="p-1">
                                <span class="group flex items-center gap-1.5 w-full px-1.5 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200">
                                    <span class="truncate">We've received your feedback</span>
                                </span>                            
                        </div>
                    </div>
                </div>
                </template>
            </UPopover>
        </UTooltip>
    </template>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const notifications = ref([]);
const groupedItems = ref([]);  // This will hold the grouped items for the dropdown
const loadingNotifications = ref(false); // Track notification loading state separately

// Function to fetch notifications
async function fetchNotificationsData() {
    try {
        loadingNotifications.value = true;
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
    } catch (error) {
        console.error('Error fetching notifications:', error);
    } finally {
        loadingNotifications.value = false;
    }
}

// Refresh notifications when the dropdown is opened
function refreshNotifications() {
    fetchNotificationsData();
}

// Mark a notification as read
async function markAsRead(notificationId) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
    } else {
        // Refresh notifications after marking as read
        fetchNotificationsData();
    }
}

// Fetch notifications when the component is mounted
onMounted(async () => {
    await fetchNotificationsData();
});
</script>
