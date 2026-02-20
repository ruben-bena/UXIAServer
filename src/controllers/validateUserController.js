const { logger } = require('../config/logger');
const { User } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

const validateUser = async (req, res) => {
    try {
        logger.debug('[registerUserController] Entro en función registerUser');
        const {
            phoneNumber,
            validationCode
        } = req.body;

        // Compare body validationCode with stored one

        // If is valid, return Token

        // Retornar respuesta
        return res.status(200).json({
            status: 'OK',
            message: 'User correctly validated',
            data: {
                'token': 'pepe'
            }
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
    validateUser
}