import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT || 5000,
    ip: process.env.HOST || '0.0.0.0',
    mongo: {
      uri: process.env.MONGO_URI    
    },
    jwtSecret: process.env.SECRET_API_KEY
  };