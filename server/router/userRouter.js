const express = require('express');
const router = express.Router();
const userRender = require('../services/userRender');
const userController = require("../controller/userControllers/userAuthController");
router.get('/',userRender.homePage);

// User Register Routes
router.route('/register')
    .get(
        userRender.userRegister
    )
    .post(
        userController.userRegister
    );


module.exports = router; 