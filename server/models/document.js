'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    userId: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: true }
    },
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    content: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
      
    access: {
      type: DataTypes.STRING,
      isIn: ['READ', 'WRITE']
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Document;
};