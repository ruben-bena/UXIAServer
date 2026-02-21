const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clau_dev';
const { logger } = require('../config/logger');
const { User, Token } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

const validateUser = async (req, res) => {
    try {
        logger.debug('[registerUserController] Entro en función registerUser');
        const {
            phoneNumber,
            validationCode
        } = req.body;

        // Validación del body
        if (
            !phoneNumber?.trim() || 
            !validationCode?.trim()
        ) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid input data'
            });
        }

        // Buscar usuario con mismo número de teléfono
        logger.debug(`[registerUserController] Buscando usuario con mismo telefono (phoneNumber="${phoneNumber}")...`);
        const userWithPhoneNumber = await User.findOne({
            where: {
                phoneNumber: phoneNumber,
                isValidated: false
            }
        });
        // Contemplar caso de no encontrar usuario con ese número
        if (!userWithPhoneNumber) {
            logger.debug(`[registerUserController] Usuario con phoneNumber="${phoneNumber}" no encontrado. Retornando error...`);
            return res.status(400).json({
                status: 'ERROR',
                message: 'No user found with that phoneNumber and pending validation'
            });
        }
        logger.debug(`[registerUserController] Usuario encontrado (username="${userWithPhoneNumber.username}")`);

        // Comparar código recibido con código guardado
        // 
        // Si el código es válido, retornamos token
        // En caso contrario, retornamos error
        const isValidCode = (validationCode == userWithPhoneNumber.validationCode);
        logger.debug(`[registerUserController] Usuario válido --> ${isValidCode}`);
        if (isValidCode) {
            // Validar usuario
            logger.debug(`[registerUserController] Validando usuario...`);
            userWithPhoneNumber.validationCode = null;
            userWithPhoneNumber.isValidated = true;
            await userWithPhoneNumber.save();
            logger.debug(`[registerUserController] Usuario persistido como valido.`);

            // Crear token y guardarlo en su tabla
            logger.debug(`[registerUserController] Generando Token...`);
            await Token.destroy({
                where: { userId: userWithPhoneNumber.userId }
            });
            logger.debug(`[registerUserController] Tokens asociados al usuario borrados.`);
            const tokenValue = jwt.sign(
                {
                    userId: userWithPhoneNumber.userId,
                    phoneNumber: userWithPhoneNumber.phoneNumber,
                    isAdministrator: userWithPhoneNumber.isAdministrator || false
                },
                JWT_SECRET
            );
            await Token.create({
                userId: userWithPhoneNumber.userId,
                token: tokenValue
            });
            logger.debug(`[registerUserController] Nuevo Token generado y persistido.`);

            // Retornar token a cliente
            logger.debug(`[registerUserController] Retornando nuevo Token al usuario...`);
            return res.status(200).json({
                status: 'OK',
                message: 'User correctly validated',
                data: {
                    'api_key': tokenValue
                }
            });
        } else {
            logger.debug(`[registerUserController] Retornando error al usuario debido a código invalido...`);
            return res.status(400).json({
                status: 'ERROR',
                message: 'validationCode received does not match with persisted one'
            });
        }
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