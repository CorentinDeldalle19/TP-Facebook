import 'dotenv/config';

const config = {
  developement: {
    port: process.env.PORT,
    mongodb: process.env.URL_DATABASE 
  },
  production: {
    port: process.env.PORT,
    mongodb: process.env.URL_DATABASE
  }
};

export default config;