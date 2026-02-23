const { logger } = require('../config/logger');
const { Response } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

const getTags = async (req, res) => {
    try {
        logger.debug('[getTagsController] Entro en getTagsController');
        // Obtener todos los Responses

        // Recorrer responses y construir el JSON de tags

        // Retornar el JSON de tags
        return res.status(200).json({
            status: 'PRUEBA',
            message: 'API Endpoint llamado correctamente. Esto es sólo una prueba.'
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
    getTags
}