const Sequelize = require('sequelize');

module.exports = class Form extends (
  Sequelize.Model
) {
  static init(sequelize) {
    return super.init(
      {
        session: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        data: {
          type: Sequelize.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Form',
        tableName: 'forms',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Form.belongsTo(db.User);
  }
};
