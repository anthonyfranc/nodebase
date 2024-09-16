export const useUserProfile = async () => {
    try {
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const state = reactive({
            profile: [],
            email: user.email,
            user_id: user.id,
            error: null,
            refreshUserProfile: async () => {
                try {
                    const { data: updatedProfile, error: refreshError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (refreshError) throw refreshError;

                    state.profile = updatedProfile; // Update the reactive state
                } catch (refreshError) {
                    console.error('Error refreshing user profile:', refreshError);
                    state.error = refreshError; // Update error state
                    throw refreshError;
                }
            }
        });

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        state.profile = profile; // Update the reactive state

        return state;
    } catch (error) {
        console.error(error);
        return { error };
    }
};