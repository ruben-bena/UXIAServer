const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const JWT_SECRET = process.env.JWT_SECRET || 'clau_dev';
const { logger } = require('../config/logger');

/**
 * LOGIN
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info('New call to /api/admin/usuaris/login');

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.json({
        status: 'ERROR',
        message: 'Usuari o contrasenya incorrectes'
      });
    }

    if (!user.isAdministrator) {
      return res.json({
        status: 'ERROR',
        message: 'Usuari sense permisos d’administrador'
      });
    }

    if (!user.isValidated) {
      return res.json({
        status: 'ERROR',
        message: 'Usuari no validat'
      });
    }

    const tokenValue = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        isAdministrator: true
      },
      JWT_SECRET
    );

    await Token.destroy({ where: { userId: user.userId } });
    await Token.create({ userId: user.userId, token: tokenValue });

    user.lastTimeLogged = new Date();
    await user.save();

    return res.json({
      status: 'OK',
      message: 'Usuari autenticat correctament',
      data: { token: tokenValue }
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error intern'
    });
  }
};

/**
 * TEST TOKEN
 */
const adminTestToken = async (req, res) => {
  try {
    logger.info('New call to /api/admin/usuaris/testtoken');

    const userId = req.user.userId;  // extraído por adminAuth
    const tokenValue = req.token;    // extraído por adminAuth

    // Buscar token en la BBDD
    const tokenInDb = await Token.findOne({
      where: { userId, token: tokenValue }
    });

    if (!tokenInDb) {
      // Token NO coincide con la BBDD → error
      return res.status(401).json({
        status: 'ERROR',
        message: 'Token invàlid'
      });
    }

    // Token coincide → OK
    return res.json({
      status: 'OK',
      message: 'Token vàlid'
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Error intern'
    });
  }
};


/**
 * LOGOUT
 */
const adminLogout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tokenValue = req.token;

    const token = await Token.findOne({ where: { userId } });

    if (!token || token.token !== tokenValue) {
      return res.json({
        status: 'ERROR',
        message: 'Token invàlid. Logout realitzat localment'
      });
    }

    await Token.destroy({ where: { userId } });

    return res.json({
      status: 'OK',
      message: 'Logout correcte'
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
  adminLogin,
  adminLogout,
  adminTestToken
};
