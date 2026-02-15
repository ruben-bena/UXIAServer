const { logger } = require('../config/logger');
const { Request } = require('../models');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

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
      userId: "4789e020-09b4-11f1-84ff-f6f0c5648c52", // userId for 'testUser'
      prompt: prompt
    });
    logger.debug('[analyzeImageController] Objeto Request consolidado con éxito.');

    // Petición a la IA
    const base64 = await imageToBase64('./assets/labrador.jpg');
    const requestBody = {
      model: process.env.MARIA_24_OLLAMA_MODEL,
      prompt: prompt,
      images: [base64],
      stream: false
    };
    const ollamaResponse = await fetch(`${process.env.MARIA_24_OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    return res.json({
      status: 'OK',
      message: ollamaResponse.response
    });

    // Consolidar respuesta de la IA en objeto Response

    // Retornar respuesta

    logger.debug('Retornando un placeholder que habrá que cambiar..."');
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

async function imageToBase64(imagePath) {
    try {
        const data = await fs.readFile(imagePath);
        return Buffer.from(data).toString('base64');
    } catch (error) {
        console.error(`Error al llegir o convertir la imatge ${imagePath}:`, error.message);
        return null;
    }
}

module.exports = {
    analyzeImage
}
