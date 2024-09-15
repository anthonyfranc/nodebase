// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxtjs/fontaine', '@nuxtjs/google-fonts', '@nuxt/ui', 'nuxt-aos', '@nuxtjs/supabase', '@nuxt/image', '@nuxt/content', '@vueuse/nuxt', 'nuxt-og-image', '@nuxt/eslint', '@nuxthq/studio'],

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter((c) => ['UButton'].includes(c.pascalName))

      globals.forEach((c) => c.global = true)
    }
  },
  supabase: {
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcHR4bWJzdGRncWphYmNqenJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzNTA2NDksImV4cCI6MjA0MTkyNjY0OX0.8SepDNvOZFTe_FfI44UZo_lGxo9Bi7R8yfsDsvjLpbw',
    url: 'https://cjptxmbstdgqjabcjzrm.supabase.co',
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      }
    },
    redirect: false
  },
  colorMode: {
    preference: 'light'
  },
  fontMetrics: {
    fonts: ['DM Sans']
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700]
    }
  },
  studio: {
    enabled: true
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  ssr: true,
  compatibilityDate: '2024-09-15'
})