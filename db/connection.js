const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
