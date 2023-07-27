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
    type: DataTypes.STRING, // Array of comment texts
    allowNull: true, // Allow the field to be nullable
    
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      // Format createdAt date to display in a readable format
      return new Date(this.getDataValue('createdAt')).toLocaleString();
    }
  }
}, {
  sequelize: db,
  modelName: 'thought'
});




module.exports = Thought;
