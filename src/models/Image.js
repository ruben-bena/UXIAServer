const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Image = sequelize.define('Image', {
    imageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    requestId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Requests',
            key: 'requestId'
        }
    },
    base64Image: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    }
});

module.exports = Image;