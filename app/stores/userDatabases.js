export const useUserDatabasesStore = defineStore('userDatabases', () => {
  const supabase = useSupabaseClient()
  const data = ref(null)
  const status = ref('idle')
  const error = ref(null)

  async function fetchUserDatabases(userId) {
    if (status.value === 'pending') return
    status.value = 'pending'
    error.value = null

    try {
      const { data: result, error: supabaseError } = await supabase.rpc('get_user_database_metadata', {
        p_user_id: userId,
      })

      if (supabaseError) {
        throw supabaseError
      }

      data.value = result
      status.value = 'success'
    } catch (err) {
      error.value = err
      status.value = 'error'
    }
  }

  //const isLoading = computed(() => status.value === 'pending')

  return {
    data,
    isLoading: status,
    error,
    fetchUserDatabases,
  }
})
