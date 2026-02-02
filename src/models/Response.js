const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Response = sequelize.define('Response', {
    responseId: {
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
    responseContent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Response;