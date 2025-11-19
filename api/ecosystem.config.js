module.exports = {
  apps: [
    {
      name: 'janice-correia-api',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Configurações de monitoramento
      watch: false,
      max_memory_restart: '1G',
      
      // Configurações de log
      log_file: '/var/log/pm2/janice-correia-api.log',
      error_file: '/var/log/pm2/janice-correia-api-error.log',
      out_file: '/var/log/pm2/janice-correia-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ]
};