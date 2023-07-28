const { Model, DataTypes } = require('sequelize');
const db = require('../db/connection');

class Thought extends Model { }

Thought.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3
    }
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3
    }
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return new Date(this.getDataValue('createdAt')).toLocaleString();
    }
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return new Date(this.getDataValue('updatedAt')).toLocaleString();
    }
  }
}, {
  sequelize: db,
  modelName: 'thought'
});

module.exports = Thought;
