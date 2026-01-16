// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/filing.controller");

// router.post("/:matterId/merge", controller.saveMergePack);
// router.post("/:matterId/indexing", controller.saveIndexing);
// router.post("/:matterId/signatories", controller.saveSignatories);
// router.post("/:matterId/oath", controller.saveOath);
// router.post("/:matterId/checklist", controller.saveChecklist);

// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/filing.controller');

router.post('/:matterId/merge', controller.saveMergePack);
router.post('/:matterId/indexing', controller.saveIndexing);
router.post('/:matterId/signatories', controller.saveSignatories);
router.post('/:matterId/checklist', controller.saveChecklist);

module.exports = router;


