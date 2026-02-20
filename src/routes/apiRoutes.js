const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiController.js');
const adminAuth = require('../middleware/adminAuth.js');
const { analyzeImage } = require('../controllers/analyzeImageController.js');
const { registerUser } = require('../controllers/registerUserController.js');


router.post('/admin/usuaris/login', controller.adminLogin);
router.post('/admin/usuaris/logout', adminAuth, controller.adminLogout);
router.get('/admin/usuaris/testtoken', adminAuth, controller.adminTestToken);
router.post('/analitzar-imatge', analyzeImage);
router.get('/admin/usuaris', adminAuth, controller.adminGetUsers);
router.delete('/admin/usuaris/:userId', adminAuth, controller.adminDeleteUser);
router.post('/admin/usuaris', adminAuth, controller.adminCreateUser);
router.post('/usuaris/registrar', registerUser);

module.exports = router;