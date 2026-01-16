// // new code 

// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/documents.controller");

// // Document Center
// router.get("/", controller.listDocuments);
// router.post("/upload", controller.uploadDocument);
// router.post("/:documentId/version", controller.createVersion);

// // Templates
// router.get("/templates", controller.listTemplates);
// router.get("/templates/create", controller.createTemplateForm);
// router.post("/templates", controller.storeTemplate);

// // E-Filing
// router.post("/efile/:matterId/review", controller.submitEfileReview);

// module.exports = router;


//new code according to task
const express = require("express");
const router = express.Router();
const controller = require("../controllers/documents.controller");

/*
|--------------------------------------------------------------------------
| DOCUMENT CENTER
|--------------------------------------------------------------------------
*/

// List documents
router.get("/", controller.list);

// Upload document (form + submit)
router.get("/create", controller.createForm);
router.post("/create", controller.store);

// Create new version
router.post("/:documentId/version", controller.createVersion);

/*
|--------------------------------------------------------------------------
| DOCUMENT TEMPLATES
|--------------------------------------------------------------------------
*/

router.get("/templates", controller.templates);
router.get("/templates/create", controller.templateCreateForm);
router.post("/templates/create", controller.templateStore);

/*
|--------------------------------------------------------------------------
| FILING WORKSPACE
|--------------------------------------------------------------------------
*/

// Filing workspace page
router.get("/filing/:matterId", controller.filingWorkspace);

// Filing checklist save
router.post("/filing/:matterId/checklist", controller.saveChecklist);

module.exports = router;
