import { defineConfig } from 'rwsdk';

export default defineConfig({
  name: 'solstatus',
  bindings: {
    DB: {
      type: 'kv',
      durable: {
        name: 'DB'
      }
    },
    MONITOR_TRIGGER_RPC: {
      type: 'rpc',
      service: 'monitor-trigger'
    }
  },
  dev: {
    port: 3000,
  },
  build: {
    minify: true,
    target: 'es2022',
    sourcemap: true,
  },
  routes: {
    include: ['./src/routes/**/*.{jsx,tsx}'],
  },
  cloudflare: {
    routes: [
      { pattern: '*', zone: process.env.CLOUDFLARE_ZONE_ID }
    ]
  }
});