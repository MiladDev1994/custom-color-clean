
import { Model, DataTypes } from "sequelize"
import { sequelize } from "./connectMySql";

const TemplateModel = sequelize.define("sorchin_template", {
  sorchin_template_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
  template_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  template_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  template_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_login_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_stamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  program_Type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pistachio_weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reverse: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_custom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, { 
  // sequelize, 
  modelName: 'sorchin_template', 
  timestamps: false, 
  freezeTableName: false,
  tableName: "sorchin_template"
})


sequelize.sync();


export default TemplateModel;