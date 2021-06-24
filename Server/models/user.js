'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
const { encode } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo, {foreignKey: "UserId"})
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        notEmpty: {
          msg: "email can not be blank"
        },
        isEmail: {
          msg: "invalid email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty: {
          msg: "paswword can not be blank"
        },
        isMoreThanSix(value) {
          if (value.length <= 6) {
            throw new Error('Password must has minimum 6 characters');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance)=>{
    instance.password = encode(instance.password)
  })
  return User;
};