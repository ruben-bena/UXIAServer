const { logger } = require('../config/logger');
const { User } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

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

        // Generar número de 6 cifras
        
        // Enviar por SMS y esperar respuesta del Usuario

        // Recibir número usuario y validar si aplica

        // Enviar Token a usuario

        // Retornar respuesta
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