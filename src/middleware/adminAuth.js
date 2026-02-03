const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const JWT_SECRET = process.env.JWT_SECRET || 'clau_dev';

module.exports = async function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Header existe
  if (!authHeader) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Authorization header required'
    });
  }

  // Formato Bearer
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Invalid Authorization format'
    });
  }

  // Extraer token
  const tokenValue = authHeader.substring(7);

  try {
    // Verificar JWT (firma + expiración)
    const decoded = jwt.verify(tokenValue, JWT_SECRET);

    // Verificar que el token está en BBDD
    const token = await Token.findOne({
      where: {
        userId: decoded.userId,
        token: tokenValue
      }
    });

    if (!token) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Token invalid'
      });
    }

    // Guardar info del usuario para el controller
    req.user = decoded;
    req.token = tokenValue;

    next();

  } catch (error) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Token expired or invalid'
    });
  }
};
