// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4
    },
    compatibilityDate: '2024-10-10',

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
        }
    },

    devtools: {
        enabled: false
    }
})