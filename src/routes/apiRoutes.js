const express = require('express');
const router = express.Router();

router.post('/admin/usuaris/login', adminLogin);

module.exports = router;