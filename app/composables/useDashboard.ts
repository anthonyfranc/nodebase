import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const router = useRouter()


  defineShortcuts({
    'g-h': () => router.push('/dashboard/'),
    'g-n': () => router.push('/dashboard/news')
  })

}

export const useDashboard = createSharedComposable(_useDashboard)