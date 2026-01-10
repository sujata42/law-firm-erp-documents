const express = require('express');
const router = express.Router();
const controller = require('../controllers/documents.controller');

router.post('/cases/:caseId/documents', controller.createDocument);
router.get('/cases/:caseId/documents', controller.getDocuments);

module.exports = router;


