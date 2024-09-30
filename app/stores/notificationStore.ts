export const useNotificationsStore = defineStore('notifications', () => {
  const supabase = useSupabaseClient()
  const notifications = ref([])

  async function fetchNotifications(userId) {
      const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

      if (error) {
          console.error('Error fetching notifications:', error)
          notifications.value = []
      } else {
          notifications.value = data
      }
  }

  async function archiveNotification(notificationId) {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
          notification.is_read = true
      }

      const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)

      if (error) {
          console.error('Error archiving notification:', error)
      }
  }

  const unreadNotifications = computed(() =>
      notifications.value.filter(n => !n.is_read)
  )

  const readNotifications = computed(() =>
      notifications.value.filter(n => n.is_read)
  )

  // Real-time subscription to notifications
  const subscribeToNotifications = (userId) => {
      const subscription = supabase
          .channel(`public:notifications`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
              if (payload.new.user_id === userId) {
                  // Update notifications list with new data
                  notifications.value.unshift(payload.new)
              }
          })
          .subscribe()

      // Clean up subscription when the component is destroyed or store is disposed
      onUnmounted(() => {
          supabase.removeChannel(subscription)
      })
  }

  return {
      notifications,
      fetchNotifications,
      archiveNotification,
      unreadNotifications,
      readNotifications,
      subscribeToNotifications
  }
})