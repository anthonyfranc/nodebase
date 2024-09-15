<template>
  <UMain>
    <NuxtLoadingIndicator color="#00d266" :throttle="0"/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <UModals />
  </UMain>
</template>