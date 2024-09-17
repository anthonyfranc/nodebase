<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="gray" variant="ghost">
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <!--Page-->
      <UDashboardCard :ui="{ rounded: 'rounded-none' }" title="Beta Access"
        description="Welcome to beta access. Please report any issues you encounter." :links="[
          {
            label: 'Report an issue',
            color: 'gray',
            trailingIcon: 'i-heroicons-arrow-right-20-solid'
          }
        ]" />
      <UDashboardPanelContent>
        <UCard class="flex items-center justify-center">
          <div class="text-center ">
            <UIcon name="solar:database-outline" class="mx-auto mb-2 w-5 h-5" />
            <p class="text-gray-600">You don't have any databases.</p>
            <div class="mt-4">
              <UButton color="white" variant="solid" :ui="{ rounded: 'rounded-full' }">Create Database</UButton>
            </div>
          </div>
        </UCard>
      </UDashboardPanelContent>
      <!--End of Page-->
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const userDatabases = ref([])
const toast = useToast();

definePageMeta({
  layout: "dashboard",
});

const { status, execute: databaseExecute } = await useAsyncData(
  "database", async () => {
    const { data, error } = await supabase
      .from('user_databases')
      .select('*')
      .eq('user_id', user.value.id)
    if (error) {
      toast.add({
        title: "Error",
        description: error.message,
        color: "red",
        icon: "i-heroicons-x-mark-20-solid",
      });
    }
    userDatabases.value = data
  },
  {
    server: true,
    lazy: true,
    immediate: false
  }
);

onMounted(async () => {
  setTimeout(async () => {
    await databaseExecute();
  }, 250);
});
</script>