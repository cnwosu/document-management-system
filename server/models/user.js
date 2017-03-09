'use strict';
import bcrypt from 'bcrypt';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
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
      validate: {  len: [6,10] }
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
    }
    ,
    roleId: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: true }
    },
  },
    {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.Document, {foreignKey: 'userId'});
      }
    }
  });
  
  const hashPassword = (user, options ,callback) => {
    if(user.password !== user.password_confirmation) {
      throw new Error("Password does match password confirmation");
    }
    bcrypt.hash(user.password, 10, (err, hash) => {
      if(err) return callback(err);
      user.set('password_digest', hash);
      return callback(null, options);
    });
    
  }
  
  User.beforeCreate((user, options, callback) => {
    user.email = user.email.toLocaleLowerCase();
    
    if(user.password) {
      hashPassword(user, options, callback);
    } else {
      return callback(null, options);
    }
  });
  return User;
};