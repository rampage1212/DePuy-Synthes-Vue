/*eslint-env node*/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteSvgIcons from 'vite-plugin-svg-icons'
import apiConstants from './src/api/apiConstants'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSvgIcons({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), './src/assets/svgIcons')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  server: {
    clearScreen: false,

    proxy: {
      '/api': {
        target: apiConstants(process.env.VITE_STAGE).VITE_API_ENDPOINT,
        changeOrigin: true,
        secure: true,
        // configure: (proxy) => {
        //   proxy.on('proxyRes', function (proxyRes) {
        //     // eslint-disable-next-line no-console
        //     console.log('proxyRes', proxyRes)
        //   })
        // },
      },
    },
  },
})
