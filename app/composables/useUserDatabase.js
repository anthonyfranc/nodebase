let userDatabasesCache = null
let statusCache = null
let errorCache = null

export function useUserDatabases(userId) {
  const supabase = useSupabaseClient()
  const mainStore = useMainStore()

  if (!userDatabasesCache) {
    const { data, error, refresh, execute, status } = useAsyncData(
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
        lazy: false,
        immediate: false,
        watch: [mainStore]
      }
    )

    userDatabasesCache = data
    statusCache = status
    errorCache = error

    // Start data fetching once
    execute()
  }

  const isLoading = computed(() => statusCache.value === 'pending')

  return {
    userDatabases: userDatabasesCache,
    isLoading:statusCache,
    error: errorCache,
  }
}