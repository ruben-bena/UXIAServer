const axios = require('axios');

const { logger } = require('../config/logger');

const adminLogin = async (req, res, next) => {
    try {
        logger.info('New call to /api/admin/usuaris/login');

        await res.status(201).json({
            message: 'You called to /api/admin/usuaris/login...Called received OK'
        });

    } catch (error) {

    }
};

module.exports = {
    adminLogin
}