import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (originsValue) => {
  if (!originsValue) return ['http://localhost:5173', 'http://localhost:3000'];
  return originsValue.split(',').map((origin) => origin.trim()).filter(Boolean);
};

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_polling',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
};
