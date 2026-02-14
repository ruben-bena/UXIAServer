const { logger } = require('../config/logger');

const analyzeImage = async (req, res) => {
  try {
    const {
      imageBase64,
      prompt,
      model,
      stream
    } = req.body;

    // Validación del body
    if (!prompt?.trim()) {
            logger.warn('El campo "prompt" está vacío --> retornando error a cliente');
            return res.status(400).json({ message: 'Campo "prompt" es obligatorio' });
    };

    // Consolidar objeto Request
    logger.debug('[analyzeImageController] Consolidando objeto Request...');
    const newRequest = await Request.create({
      prompt: prompt
    });
    logger.debug('[analyzeImageController] Objeto Request consolidado con éxito.');

    // Petición a la IA

    // Consolidar respuesta de la IA en objeto Response

    // Retornar respuesta

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