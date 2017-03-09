'use strict';
module.exports = function(sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
    tittle: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Roles;
};