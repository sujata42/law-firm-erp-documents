const express = require('express');
const router = express.Router();
const controller = require('../controllers/signatories.controller');

router.post('/documents/:documentId/signatories', controller.createSignatory);
router.get('/documents/:documentId/signatories', controller.getSignatories);

module.exports = router;
