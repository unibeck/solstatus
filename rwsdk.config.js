// RedwoodSDK Configuration
export default {
  // Base configuration for the project
  project: {
    name: 'solstatus',
    title: 'SolStatus', 
    description: 'Monitor your endpoints'
  },
  // Server configuration
  server: {
    port: 3000,
    apiPath: '/api',
  },
  // Client configuration
  client: {
    // Use existing styling configuration
    styling: {
      tailwind: true,
    }
  },
  // Database connection remains the same, using Cloudflare D1
  database: {
    provider: 'cloudflare',
  },
}