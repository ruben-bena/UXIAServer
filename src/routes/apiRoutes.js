const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/apiController');


router.post('/admin/usuaris/login', adminLogin);

module.exports = router;