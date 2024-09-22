<template>
    <template v-if="notifications.length === 0">
        <UDropdown text="Notifications" :shortcuts="['N']">
            <USkeleton class="h-7 w-7 border border-gray-200 dark:border-gray-800 mr-2"
                :ui="{ rounded: 'rounded-full' }" />
        </UDropdown>
    </template>
    <template v-else>
        <UTooltip text="Notifications" :shortcuts="['N']">
            <UDropdown :items="groupedItems" :popper="{ placement: 'bottom-start' }" :ui="{ width: 'w-1/4' }"
                @click="refreshNotifications">
                <UChip inset position="top-right" :color="notifications.length > 0 ? 'green' : 'gray'" class="mr-2">
                    <UAvatar icon="i-heroicons-bell" size="sm" class="border border-gray-200 dark:border-gray-800" />
                </UChip>
                <template #account="{ item }">
                    <div class="text-left">
                        <p>Signed in as</p>
                        <p class="truncate font-medium text-gray-900 dark:text-white">{{ item.label }}</p>
                    </div>
                </template>
                <template #item="{ item }" v-if="loadingNotifications">
                    Loading
                </template>
                <template #item="{ item }" v-if="!loadingNotifications">
                    <span class="truncate">{{ item.label }}</span>
                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                </template>
            </UDropdown>
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
