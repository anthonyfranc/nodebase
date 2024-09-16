export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', 'nuxt-og-image', '@nuxthq/studio', '@nuxt/ui', '@sentry/nuxt/module', '@nuxtjs/google-fonts', 'nuxt-aos', '@nuxtjs/supabase'],
  sentry: {
    sourceMapsUploadOptions: {
      org: "nodebase",
      project: "other",
      authToken: "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",
    },
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
      realtime:{
        params:{
          eventsPerSecond: 2
        }
      }
    },
    redirect: false
  },
  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true }
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  devtools: {
    enabled: true
  },

  colorMode: {
    preference: 'dark'
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

  uiPro:{
    routerOptions: false
    
  },

  aos: {
    once: true
  },

  typescript: {
    strict: false
  },
  future: {
    compatibilityVersion: 4,
  },
  build: { 
    transpile: ["shiki"],
  },

  compatibilityDate: '2024-09-15',
})