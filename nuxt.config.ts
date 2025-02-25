// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
      compatibilityVersion: 4
  },

  modules: [
      '@nuxtjs/leaflet',
      '@nuxt/icon',
      '@pinia/nuxt'
  ],

  css: [
      '@/assets/styles/global.scss',
      '@panoramax/web-viewer/build/index.css'
  ],

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  api: 'modern'
              }
          }
      },
      server: {
        allowedHosts: [".ngrok-free.app"]
      }
  },

  devtools: {
      enabled: false
  },

  nitro: {
      preset: 'node-server',
      experimental: {
          websocket: true,
      },
      externals: {
          inline: ['vue', 'vue/server-renderer']
      }
  },

  compatibilityDate: '2025-01-21'
})