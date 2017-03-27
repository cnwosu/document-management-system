'use strict';

// var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    username: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    password_digest: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: true
      }
    },
    password_confirmation: {
      type: DataTypes.VIRTUAL
    },
    roleId: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: true }
    },
  },
    {
      classMethods: {
        associate: (models) => {
        // associations can be defined here
          User.hasMany(models.Document, { foreignKey: 'userId' });
        }
      }
    });
  return User;
};
