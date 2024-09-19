export function useUserDatabases(userId) {
  const supabase = useSupabaseClient()
  const mainStore = useMainStore()

  const { data: userDatabases, error, refresh, execute: startDatabaseRun, status } = useAsyncData(
    'user-databases',
    async () => {
      const { data, error } = await supabase.rpc('get_user_database_metadata', {
        p_user_id: userId,
      })

      if (error) {
        throw error
      }

      return data
    },
    {
      server: false,
      lazy: true,
      immediate: false, // Prevents immediate execution
      watch: [userId, mainStore], // Triggers execution when these change
    }
  )


  onMounted(async () => {
    await startDatabaseRun()
  })
  return {
    userDatabases,
    isLoading: status,
    error,
    refresh,
  }
}