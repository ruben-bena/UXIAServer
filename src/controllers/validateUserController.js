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
        // Buscar usuario con mismo número de teléfono
        logger.debug(`[registerUserController] Buscando usuario con mismo telefono (phoneNumber=${phoneNumber})...`);
        const userWithPhoneNumber = User.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        });
        // TODO: Contemplar caso de no encontrar usuario con ese número
        logger.debug(`[registerUserController] Usuario encontrado (username=${userWithPhoneNumber.username}`);

        // Comparar código recibido con código guardado
        

        // Si el código es válido, retornamos token
        // En caso contrario, retornamos error

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