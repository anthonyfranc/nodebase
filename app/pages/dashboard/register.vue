<template>
    <UHeader>
        <template #logo>
            <AppLogo class="ml-1" />
        </template>
    </UHeader>
    <div class="h-screen flex flex-col items-center justify-center">
        <UCard class="max-w-lg w-full">
            <UForm :validate="validate" :state="state" @submit="onSubmit">
                <div class="flex gap-x-2 !mt-6 w-full">
                    <UFormGroup label="First name" name="firstName" class="w-1/2">
                        <UInput name="firstName" v-model="state.firstName" placeholder="John" class="flex-1" />
                    </UFormGroup>
                    <UFormGroup label="Last name" name="lastName" class="w-1/2">
                        <UInput name="lastName" v-model="state.lastName" placeholder="Doe" class="flex-1" />
                    </UFormGroup>
                </div>
                <UFormGroup label="Email" name="email" class="pt-2">
                    <UInput name="email" v-model="state.email" placeholder="you@example.com" />
                </UFormGroup>
                <div class="flex gap-x-2 !mt-6">
                    <UFormGroup label="Password" name="password" class="w-1/2">
                        <UInput name="password" v-model="state.password" placeholder="••••••••" type="password"
                            class="flex-1" />
                    </UFormGroup>
                    <UFormGroup label="Confirm Password" name="confirmPassword" class="w-1/2">
                        <UInput name="confirmPassword" v-model="state.confirmPassword" placeholder="••••••••"
                            type="password" class="flex-1" />
                    </UFormGroup>
                </div>
                <p class="text-sm !mt-4 !mb-4 text-center">By signing up, you agree to our <NuxtLink to="/"
                        class="text-primary font-medium">Terms of Service
                    </NuxtLink>
                </p>
                <UButton type="submit" class="!mt-4 !mb-4" block :loading="loading" :disabled="!canSend">
                    Create an account
                </UButton>
                <div class="text-sm font-light text-gray-500 dark:text-gray-300">
                <div class="py-1 text-center">Already have an account? <NuxtLink to="./login"
                        class="text-primary font-medium">Login
                    </NuxtLink>
                </div>
            </div>
            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const user = useSupabaseUser()
const supabase = useSupabaseClient<any>()

const toast = useToast()
const loading = ref(false)

const state = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''

})

const canSend = computed(() => {
    return Boolean(
        state.firstName &&
        state.lastName &&
        state.email &&
        state.password &&
        state.confirmPassword)
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.firstName) errors.push({ path: 'firstName', message: ' ' })
    if (!state.lastName) errors.push({ path: 'lastName', message: ' ' })
    if (!state.email) errors.push({ path: 'email', message: ' ' })
    if (!state.password) errors.push({ path: 'password', message: ' ' })
    if (!state.confirmPassword) errors.push({ path: 'confirmPassword', message: ' ' })
    if (state.password !== state.confirmPassword) errors.push({ path: 'confirmPassword', message: ' ' })
    return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
    if (loading.value || !canSend.value) {
        return;
    }
    loading.value = true;

    try {
        // Attempt to sign up the user.
        const { data: getUser, error: signUpError } = await supabase.auth.signUp({
            email: state.email,
            password: state.password,
        });

        if (signUpError) {
            throw signUpError;
        }

        // Assuming signUp is successful, and we have a user object with an id.
        if (getUser) {
            // Insert firstName and lastName into the profiles table.
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { id: getUser.user.id, first_name: event.data.firstName, last_name: event.data.lastName },
                ]);

            if (profileError) {
                throw profileError;
            }

            // Show success toast message.
            toast.add({
                title: 'Notification',
                description: 'You have successfully created an account, you will be logged in shortly.',
                color: 'green',
            });
        }
    } catch (err) {
        // Show error toast message.
        toast.add({
            title: 'Notification',
            description: 'Sorry we were unable to create an account for you.',
            color: 'red',
        });
    } finally {
        loading.value = false;
        // Attempt to sign in the user after sign up.
        const { data, error } = await supabase.auth.signInWithPassword({
            email: event.data.email,
            password: event.data.password,
        });

        if (user) {
            // Navigate to dashboard if sign-in is successful.
            return navigateTo('/dashboard/');
        }
    }
}

</script>