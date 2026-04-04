import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import App from '@/App';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#4f6ef7',
    colorBgBase: '#0f1117',
    colorBgContainer: '#1e2235',
    colorBgElevated: '#252840',
    borderRadius: 10,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    Input: {
      colorBgContainer: '#252840',
      colorBorder: '#2e3250',
    },
    Button: {
      colorBgContainer: '#252840',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
