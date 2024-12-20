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

                <!-- Password input and strength meter -->
                <div class="flex gap-x-2 !mt-6">
                    <UFormGroup label="Password" name="password" class="w-1/2">
                        <UInput name="password" v-model="state.password" placeholder="••••••••" type="password"
                            class="flex-1" @input="updatePasswordStrength" />
                    </UFormGroup>
                    <UFormGroup label="Confirm Password" name="confirmPassword" class="w-1/2">
                        <UInput name="confirmPassword" v-model="state.confirmPassword" placeholder="••••••••"
                            type="password" class="flex-1" />
                    </UFormGroup>
                </div>

                <!-- Password strength meter and label -->
                <UMeterGroup :max="80">
                    <template #indicator>
                        <div class="flex gap-1.5 justify-between text-sm pt-2">
                            <p>Password Strength</p>
                            <p class="text-gray-500 dark:text-gray-400">
                                {{ strengthLabel }}
                            </p>
                        </div>
                    </template>
                    <UMeter :value="passwordStrength" label="Strength" icon="heroicons:lock-closed" :max="80" :color="strengthColor" />
                </UMeterGroup>

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
import type { FormError, FormSubmitEvent, MeterColor } from '#ui/types'

const supabase = useSupabaseClient()
const toast = useToast()

const loading = ref(false)
const passwordStrength = ref(0)
const strengthLabel = ref('Weak')
const strengthColor = ref<MeterColor>('red')  // Default color for Weak

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
        state.confirmPassword &&
        passwordStrength.value >= 60 &&
        state.password === state.confirmPassword
    )
})

const validate = (state: any) => {
    const errors: FormError[] = []
    if (!state.firstName) errors.push({ path: 'firstName', message: ' ' })
    if (!state.lastName) errors.push({ path: 'lastName', message: ' ' })
    if (!state.email) errors.push({ path: 'email', message: ' ' })
    if (!state.password) errors.push({ path: 'password', message: ' ' })
    if (!state.confirmPassword) errors.push({ path: 'confirmPassword', message: ' ' })
    if (state.password !== state.confirmPassword) errors.push({ path: 'confirmPassword', message: ' ' })
    return errors
}

const updatePasswordStrength = () => {
    const password = state.password.trim() // Make sure we're not counting any whitespace

    let score = 0

    // **Strength criteria:**
    // 1. Longer password (12+ characters for strong score)
    if (password.length >= 12) {
        score += 30 // Give more weight to length
    } else if (password.length >= 8) {
        score += 10 // Still passable but weak
    }

    // 2. Use of uppercase letters
    if (/[A-Z]/.test(password)) {
        score += 20
    }

    // 3. Use of lowercase letters
    if (/[a-z]/.test(password)) {
        score += 10
    }

    // 4. Use of numbers
    if (/[0-9]/.test(password)) {
        score += 20
    }

    // 5. Use of special characters (e.g. !@#$%)
    if (/[\W]/.test(password)) {
        score += 20
    }

    // 6. Prevent common dictionary words (basic example)
    // This can be replaced by a more comprehensive dictionary check
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'admin', 'letmein']
    if (commonPasswords.some(commonPassword => password.toLowerCase().includes(commonPassword))) {
        score -= 40 // Penalize heavily for common passwords
    }

    // 7. Bonus: Avoid predictable patterns like 'abc', '1234', or sequential characters
    if (/([a-zA-Z0-9])\1{2,}/.test(password)) {
        score -= 20 // Penalize repeating characters
    }

    // **Update the reactive strength values**
    passwordStrength.value = score

    // **Update strength label and color based on the score**
    if (score <= 30) {
        strengthLabel.value = 'Very Weak'
        strengthColor.value = 'red'
    } else if (score <= 50) {
        strengthLabel.value = 'Weak'
        strengthColor.value = 'orange'
    } else if (score <= 70) {
        strengthLabel.value = 'Moderate'
        strengthColor.value = 'yellow'
    } else if (score <= 90) {
        strengthLabel.value = 'Strong'
        strengthColor.value = 'green'
    } else {
        strengthLabel.value = 'Very Strong'
        strengthColor.value = 'darkgreen'
    }
}

watch(() => state.password, (newPassword) => {
    //console.log("Password updated to:", newPassword)
    if (!newPassword || newPassword === "") {
        //console.log("Password is empty, resetting meter")
        passwordStrength.value = 0
        strengthLabel.value = 'Weak'
        strengthColor.value = 'red'
    } else {
        updatePasswordStrength()
    }
})

async function onSubmit(event: FormSubmitEvent<any>) {
    if (loading.value || !canSend.value) return

    loading.value = true
    try {
        const { data: getUser, error: signUpError } = await supabase.auth.signUp({
            email: state.email,
            password: state.password,
        })

        if (signUpError) throw signUpError

        if (getUser) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { id: getUser.user.id, first_name: event.data.firstName, last_name: event.data.lastName },
                ])

            if (profileError) throw profileError

            toast.add({
                title: 'Notification',
                description: 'You have successfully created an account, you will be logged in shortly.',
                color: 'green',
            })
            const { error } = await supabase.auth.signInWithPassword({
            email: event.data.email,
            password: event.data.password,
        })
        if (!error) return navigateTo('/dashboard/')
        }
    } catch (err) {
        toast.add({
            title: 'Notification',
            description: 'Sorry we were unable to create an account for you.',
            color: 'red',
        })
    } finally {
        loading.value = false
    }
}
</script>
