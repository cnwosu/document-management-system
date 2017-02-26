'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    userId: DataTypes.INTEGER,
    tittle: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Document;
};