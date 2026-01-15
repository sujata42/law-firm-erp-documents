const express = require('express');
const router = express.Router();
const controller = require('../controllers/oath.controller');

router.post('/cases/:caseId/oath', controller.createOath);
router.get('/cases/:caseId/oath', controller.getOaths);

module.exports = router;
