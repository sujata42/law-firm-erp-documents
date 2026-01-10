const express = require('express');
const router = express.Router();
const controller = require('../controllers/oath.controller');

router.post('/cases/:caseId/oath', controller.createOath);

module.exports = router;
