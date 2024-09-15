export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-og-image',
    '@nuxthq/studio',
    '@nuxt/ui',
    '@sentry/nuxt/module'
  ],
  sentry: {
    sourceMapsUploadOptions: {
      org: "nodebase",
      project: "other",
      authToken: "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",
    },
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

  typescript: {
    strict: false
  },
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-09-15',
})