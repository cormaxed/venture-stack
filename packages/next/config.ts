const config = {
  // Backend config
  cognito: {
    REGION: process.env.NEXT_PUBLIC_REGION,
    USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
    APP_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
  },
};

export default config;
