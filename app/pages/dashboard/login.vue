<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <UCard class="max-w-sm w-full shadow-md">
      <UForm :validate="validate" :state="state" @submit="onSubmit">
        <NuxtLink to="/" class="flex justify-center"> <!-- Center HomeLogo -->
          <div class="flex items-center">
            <UIcon name="solar:bolt-circle-bold" style="color: #14cc76" class="h-7 w-7 mb-0.2 mr-0.5" />
            <span class="text-3xl font-semibold">Nodebase</span>
          </div>
        </NuxtLink>
        <UFormGroup label="Email" name="email" class="pt-2 mb-2.5">
          <UInput name="email" v-model="state.email" placeholder="you@example.com" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput name="password" v-model="state.password" placeholder="••••••••" type="password" class="flex-1" />
        </UFormGroup>
        <UButton type="submit" class="!mt-4 !mb-4" block :loading="loading" :disabled="!canSend">
          Login
        </UButton>
      </UForm>
      <div class="text-sm font-light text-gray-500 dark:text-gray-300">
        <div class="py-1 text-center">
          Don't have an account yet?
          <NuxtLink to="./register" class="text-primary font-medium">
            Register
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

/**
 * user: Retrieves the current user session from Supabase.
 * auth: Provides access to Supabase auth APIs.
 * toast: Allows displaying toast notifications.
 * loading: Tracks whether a request is currently in progress.
 */
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const toast = useToast();
const loading = ref(false);

/**
 * Defines the fields for the login form.
 *
 * Contains an email field and a password field.
 */
const state = reactive({
  email: "",
  password: "",
});

const canSend = computed(() => {
  return Boolean(
    state.email &&
    state.password)
})

/**
 * Validates the form state and returns any validation errors.
 * Checks for required email and password fields.
 */
const validate = (state: any) => {
  const errors: FormError[] = [];
  if (!state.email) errors.push({ path: "email", message: " " });
  if (!state.password) errors.push({ path: "password", message: " " });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  if (loading.value || !canSend.value) {
    return;
  }
  loading.value = true;
  try {
    /**
     * Attempts to sign the user in with the provided email and password using the
     * Supabase auth client.
     *
     * Throws any auth errors. If successful, navigates to the /dashboard route.
     */
    const { error } = await auth.signInWithPassword({
      email: event.data.email,
      password: event.data.password,
    });
    if (error) {
      throw error;
    }
    if (user.value) {
      navigateTo("/dashboard/");
    }
  } catch (err) {
    toast.add({
      title: "Notification",
      description: "Sorry, we were unable to log you in, please try again.",
      color: "red",
    });
  } finally {
    loading.value = false;

    /**
     * Sets all values in the given data object to null.
     *
     * @param {Object} data - The data object to clear.
     */
    for (let key in event.data) {
      event.data[key] = null;
    }
  }
}
</script>