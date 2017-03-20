
module.exports = (sequelize, DataTypes) => {
  let Document = sequelize.define('Document', {
    userId: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: true }
    },
    ownerRoleId: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: true }
    },
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    content: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true }
    },

    access: {
      type: DataTypes.ENUM('public', 'private', 'role'),
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      }
    }
  });
  return Document;
};
