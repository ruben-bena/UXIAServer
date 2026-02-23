const { logger } = require('../config/logger');
const { Response } = require('../models');

const getTags = async (req, res) => {
    try {
        logger.debug('[getTagsController] Recopilando todos los objetos Response...');

        const responses = await Response.findAll({
            attributes: ['tags']
        });

        logger.debug('[getTagsController] Objetos Response recopilados');

        const tagCount = {};

        responses.forEach(response => {
            const tags = response.tags;

            // Si no hay tags, saltamos
            if (!tags) return;

            // Si tags es un array
            if (Array.isArray(tags)) {
                tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });

        return res.status(200).json({
            status: 'OK',
            data: tagCount
        });

    } catch (error) {
        logger.error(error);

        return res.status(500).json({
            status: 'ERROR',
            message: 'Error intern'
        });
    }
};

module.exports = {
    getTags
};