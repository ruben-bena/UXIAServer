const { logger } = require('../config/logger');

const analyzeImage = async (req, res) => {
  try {
    logger.debug('Entro en función "analyzeImage"');
    return res.json({
      status: 'OK',
      message: 'Maria image processed'
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
    analyzeImage
}