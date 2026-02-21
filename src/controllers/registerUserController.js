const { logger } = require('../config/logger');
const { User } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();
const axios = require('axios');

const registerUser = async (req, res) => {
    try {
        logger.debug('[registerUserController] Entro en función registerUser');
        const {
            username,
            password,
            phoneNumber,
            email
        } = req.body;

        // Validación del body

        // Persistir objeto User
        logger.debug('[registerUserController] Consolidando objeto User...');
        const newUser = await User.create({
            username: username,
            password: password,
            phoneNumber: phoneNumber,
            email: email,
            isAdministrator: false
        });
        logger.debug('[registerUserController] Objeto User consolidado con éxito.');

        // Generar número de 6 cifras, y guardarlo en tabla del User
        const randomSixDigitsCode = Math.floor(100000 + Math.random() * 900000);
        logger.debug(`[registerUserController] Código de 6 digitos generado --> ${randomSixDigitsCode}`);
        newUser.validationCode = randomSixDigitsCode;
        await newUser.save();
        logger.debug(`[registerUserController] Guardado el código dentro de su User y persistido en BBDD.`);

        // Enviar número por SMS a teléfono registrado
        const smsServerUrlWithEndpoint = process.env.SMS_SERVER_URL + process.env.SMS_SERVER_ENDPOINT;
        const smsServerUsername = process.env.SMS_SERVER_USERNAME;
        const smsServerToken = process.env.SMS_SERVER_TOKEN;
        logger.debug('[registerUserController] Enviando SMS de validación...');
        await axios.get(smsServerUrlWithEndpoint, {
            params: {
                api_token: smsServerToken,
                username: smsServerUsername,
                text: `Validation code: ${randomSixDigitsCode}`,
                receiver: phoneNumber
            }
        });
        logger.debug('[registerUserController] SMS enviado correctamente.');

        // Retornar respuesta
        return res.status(200).json({
            status: 'OK',
            message: 'User correctly created',
            data: {
                'username': username,
                'email': email,
                'phoneNumber': phoneNumber
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
    registerUser
}