const { logger } = require('../config/logger');
const { Request, Response } = require('../models');
const fs = require('fs').promises;
require('dotenv').config();

const analyzeImage = async (req, res) => {
  try {
    const {
      images,
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
    const base64 = images[0];
    logger.debug('[analyzeImageController] Imagen convertida a base64 con éxito.');
    const requestBody = {
      model: process.env.MARIA_24_OLLAMA_MODEL,
      prompt: prompt,
      images: [base64],
      stream: false
    };
    logger.debug(`[analyzeImageController] Parámetros utilizados para la petición a Ollama: model=${requestBody.model} prompt=${requestBody.prompt}`);
    const ollamaResponse = await fetch(`${process.env.MARIA_24_OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const data = await ollamaResponse.json();
    logger.debug(`[analyzeImageController] Respuesta de completa de Ollama: ${JSON.stringify(data, null, 2)}`);

    // Consolidar respuesta de la IA en objeto Response
    logger.debug('[analyzeImageController] Consolidando objeto Response...');
    const rawModelResponse = data.response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(rawModelResponse);
    logger.debug(`parsed: ${JSON.stringify(parsed)}`);
    logger.debug(`description: ${parsed.description}`);
    logger.debug(`tags: ${parsed.tags}`);
    const newResponse = await Response.create({
      requestId: newRequest.requestId,
      responseContent: parsed.description,
      tags: parsed.tags
    });
    logger.debug('[analyzeImageController] Objeto Response consolidado con éxito');

    // Retornar respuesta
    return res.json({
      status: 'OK',
      message: JSON.stringify(data, null, 2)
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
