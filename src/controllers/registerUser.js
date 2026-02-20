const { logger } = require('../config/logger');
const { User } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        logger.debug('[registerUser] Entro en función registerUser');
        return res.status(500).json({
            status: 'OK',
            message: 'Esta ruta no está 100% implementada'
        }); 
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Error intern'
        });
    }
}

module.exports = {
    registerUser
}