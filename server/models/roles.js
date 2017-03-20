
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Roles', {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      }
    }
  });
  return Role;
};
