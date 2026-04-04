import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Easy 2FA Saver',
    description: 'Quản lý mã 2FA của bạn một cách dễ dàng và an toàn',
    version: '1.0.0',
    permissions: ['storage'],
    icons: {
      16: 'icon-16.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    action: {
      default_title: 'Easy 2FA Saver',
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

