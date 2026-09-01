// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/a11y',
    'nuxt-auth-utils'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    couchdb: {
      migration: {
        remote: 'http://127.0.0.1:5984/',
        username: 'admin',
        password: 'admin',
        enabled: false
      },
      remote: {
        admin: 'http://admin:admin@127.0.0.1:5984/',
        proxy: 'http://127.0.0.1:5984/'
      },
      secret: 'c8d6e646639a71945ec1f209e078c85b'
    },
    public: {
      pouchdb: {
        remote: 'http://127.0.0.1:5984'
      }
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        'pouchdb',
        'pouchdb-find',
        'pouchdb-quick-search', // CJS
      ]
    }
  },
  ui: {
    colorMode: false
  },
  nitro: { prerender: { autoSubfolderIndex: false } }
})
