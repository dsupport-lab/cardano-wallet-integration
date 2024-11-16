const nextConfig = {
    webpack: (config, { isServer }) => {
      config.experiments = {
        asyncWebAssembly: true,
        layers: true,
      };
  
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
        };
      }
  
      return config;
    }
  };
  
  export default nextConfig;
  