export const useUserDatabasesStore = defineStore('userDatabases', () => {
  const supabase = useSupabaseClient()
  const data = ref(null)
  const status = ref('idle')
  const error = ref(null)

  const MIN_LOADING_TIME = 1000 // Minimum loading time in milliseconds
  const TIMEOUT_DURATION = 5000 // Maximum request time in milliseconds

  async function fetchUserDatabases(userId) {
    if (status.value === 'pending') return
    status.value = 'pending'
    error.value = null

    const startTime = Date.now()

    // Create the Supabase RPC promise
    const supabasePromise = supabase.rpc('get_user_database_metadata', {
      p_user_id: userId,
    })

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'))
      }, TIMEOUT_DURATION)
    })

    try {
      // Use Promise.race to race between the Supabase RPC call and the timeout
      const result = await Promise.race([supabasePromise, timeoutPromise])

      // Check for Supabase errors
      if (result.error) {
        throw result.error
      }

      const elapsedTime = Date.now() - startTime
      const remainingTime = MIN_LOADING_TIME - elapsedTime

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      data.value = result.data
      status.value = 'success'
    } catch (err) {
      error.value = err
      status.value = 'error'
    }
  }

  //const isLoading = computed(() => status.value === 'pending')
  console.log(status)
  return {
    data,
    isLoading: status,
    error,
    fetchUserDatabases,
  }
})