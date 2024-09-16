export default defineNuxtRouteMiddleware(async (to, from) => {
    //if user is logged in and is trying to access login/register send them back to dashboard
    if(to.path === '/dashboard/login' || to.path === '/dashboard/register'){
        const user = useSupabaseUser()
        if(user.value){
            return navigateTo('/dashboard/')
        }
    }
    //If the user is not logged in and is trying to access dashboard send them to login
    if((to.path === '/dashboard/') || (to.path.startsWith('/dashboard') && !to.path.startsWith('/dashboard/login') && !to.path.startsWith('/dashboard/register'))){
        const user = useSupabaseUser()
        if(!user.value){
            return navigateTo('/dashboard/login')
        }
    }
})