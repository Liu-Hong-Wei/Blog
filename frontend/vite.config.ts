import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 添加base配置，确保资源路径正确
  base: '/',
  build: {
    // 确保资源文件放在assets目录下
    assetsDir: 'assets',
    // 代码分割优化
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // React 相关依赖
          'react-vendor': ['react', 'react-dom'],
          // 路由相关依赖
          'router': ['react-router'],
          // Markdown 处理相关依赖
          'markdown': ['unified', 'remark-parse', 'remark-rehype', 'rehype-react'],
          // Tailwind CSS（如果需要的话）
          'styles': [],
        },
        // 为动态导入的模块定义命名策略
        chunkFileNames: (chunkInfo) => {
          // 为页面组件使用 'pages' 前缀
          if (chunkInfo.name && chunkInfo.name.includes('pages')) {
            return 'assets/pages/[name]-[hash].js';
          }
          // 为其他组件使用 'components' 前缀
          if (chunkInfo.name && chunkInfo.name.includes('components')) {
            return 'assets/components/[name]-[hash].js';
          }
          // 默认命名
          return 'assets/js/[name]-[hash].js';
        },
      },
    },
    // 设置代码分割的最小大小（字节）
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
