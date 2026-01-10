// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/indexes.controller');

// router.post('/documents/:documentId/indexes', controller.createIndex);

// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexes.controller');

router.post('/documents/:documentId/indexes', controller.createIndex);
router.get('/documents/:documentId/indexes', controller.getIndexes);


// router.post('/documents/:documentId/indexes', (req, res, next) => {
//   console.log('INDEX ROUTE HIT', req.params);
//   next();
// }, controller.createIndex);




module.exports = router;
