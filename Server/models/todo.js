'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {foreignKey: "UserId"})
    }
  };
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty : {
          msg: `title required`
        }
      }
    },
    description:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty : {
          msg: `description required`
        }
      }
    },
    status:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty : {
          msg: `status required`
        }
      }
    },
    due_date:  {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty : {
          msg: `title required`
        },
        isAfterYesterday(value) {
          const dateInput = new Date (`${value}`)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          if (dateInput < yesterday) {
            throw new Error('due_date can not before today!');
          }
        }
      }
    },
    UserId:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    location:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty : {
          msg: `location required`
        }
      }
    },
    weather: {
      type: DataTypes.VIRTUAL,
      set(value){
        this.setDataValue('weather', value)
      }
    }

  }, {
    sequelize,
    modelName: 'Todo',
  });
  Todo.beforeCreate((instance)=>{
    instance.location = instance.location[0].toUpperCase() + instance.location.slice(1)
  })
  return Todo;
};