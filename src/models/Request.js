const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Request = sequelize.define('Request', {
    requestId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId'
        }
    },
    prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    model: {
        type: DataTypes.STRING,
        defaultValue: process.env.MARIA_24_OLLAMA_MODEL,
        allowNull: false
    },
    stream: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }    
});

module.exports = Request;