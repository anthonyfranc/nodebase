export const useUserProfile = async () => {
    try {
      const supabase = useSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      //if (!user) throw new Error('No user found');
  
      const state = reactive({
        profile: null,  // Initialize as null, so it's clear when the data is not yet fetched
        email: user.email,
        user_id: user.id,
        error: null,
        loading: true,  // Track the loading state
        refreshUserProfile: async () => {
          try {
            const { data: updatedProfile, error: refreshError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
  
            if (refreshError) throw refreshError;
  
            state.profile = updatedProfile;  // Update the reactive state
          } catch (refreshError) {
            console.error('Error refreshing user profile:', refreshError);
            state.error = refreshError;  // Update error state
            throw refreshError;
          }
        }
      });
  
      // Fetch initial profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (error) throw error;
  
      state.profile = profile;  // Update profile when fetched
      state.loading = false;  // Data is loaded
  
      return state;  // Return the reactive state
    } catch (error) {
      console.error(error);
      return { error, loading: false };  // Ensure we return the error and set loading to false
    }
  };
  