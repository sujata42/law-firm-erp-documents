// const express = require("express");
// const router = express.Router();
// const documentsController = require("../controllers/documents.controller");

// // Document Center
// router.get("/", documentsController.listDocuments);

// // Templates
// router.get("/templates", documentsController.listTemplates);
// router.get("/templates/create", documentsController.createTemplateForm);
// router.post("/templates", documentsController.storeTemplate);

// // E-File Workspace
// router.get("/efile/:matterId", documentsController.efileWorkspace);
// router.post("/efile/:matterId/review", documentsController.submitEfileReview);



// module.exports = router;


// new code 

const express = require("express");
const router = express.Router();
const controller = require("../controllers/documents.controller");

// Document Center
router.get("/", controller.listDocuments);
router.post("/upload", controller.uploadDocument);
router.post("/:documentId/version", controller.createVersion);

// Templates
router.get("/templates", controller.listTemplates);
router.get("/templates/create", controller.createTemplateForm);
router.post("/templates", controller.storeTemplate);

// E-Filing
router.post("/efile/:matterId/review", controller.submitEfileReview);

module.exports = router;
