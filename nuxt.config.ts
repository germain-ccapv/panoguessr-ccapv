import { realpathSync } from 'node:fs'
import { join } from 'node:path'

// pinia n'est pas une dépendance directe : on le résout depuis @pinia/nuxt (compatible pnpm)
const piniaDir = realpathSync(join(realpathSync('node_modules/@pinia/nuxt'), '..', '..', 'pinia'))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SPA uniquement pour le build statique GitHub Pages (BASE_PATH défini) ; SSR + serveur Node sinon (Docker)
  ssr: !process.env.BASE_PATH,

  app: {
    baseURL: process.env.BASE_PATH || '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'PanoGuessr',
      link: [
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }
      ]
    }
  },
  future: {
      compatibilityVersion: 4
  },

  alias: {
      // Force la version ESM de pinia (la version CJS casse vue-demi dans le bundle serveur)
      pinia: join(piniaDir, 'dist/pinia.mjs')
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