import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'The Fucking Of MFA Codes',
    description: 'Quản cmn lý mã 2FA của bạn một cách dễ cmn dàng và an cmn toàn',
    version: '1.0.1',
    permissions: ['storage'],
    host_permissions: [
      'http://localhost:3000/*',
      'https://backend-production-a132.up.railway.app/*',
    ],
    icons: {
      16: 'icon-16.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    action: {
      default_title: 'The Fucking Of MFA Codes',
      default_icon: {
        16: 'icon-16.png',
        48: 'icon-48.png',
        128: 'icon-128.png',
      },
    },
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('tailwindcss'),
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('autoprefixer'),
        ],
      },
    },
  }),
});
