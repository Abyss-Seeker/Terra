import path from 'path';
import { defineConfig, loadEnv } from 'vite'; // 保留 loadEnv
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // === 1. 添加 base 配置 (关键修复) ===
    base: mode === 'production' ? './' : '/',
    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        // === 2. 修正路径别名 (重要) ===
        '@': path.resolve(__dirname, './src'), // 通常指向 src 目录
      }
    }
  };
});