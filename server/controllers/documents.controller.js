// // controllers/documents.controller.js

// // =====================
// // Document Center
// // =====================
// exports.listDocuments = (req, res) => {
//   res.render("documents/index", {
//     title: "Document Center"
//   });
// };

// // =====================
// // Templates
// // =====================
// exports.listTemplates = (req, res) => {
//   res.render("documents/templates", {
//     title: "Document Templates",
//     templates: [
//       { id: 1, name: "Affidavit Format", category: "Affidavit" }
//     ]
//   });
// };

// exports.createTemplateForm = (req, res) => {
//   res.render("documents/template-create", {
//     title: "Create Document Template"
//   });
// };

// exports.storeTemplate = (req, res) => {
//   // Dummy save (later DB)
//   console.log("Template Created:", req.body);
//   res.redirect("/documents/templates");
// };

// // =====================
// // E-File Workspace
// // =====================
// exports.efileWorkspace = (req, res) => {
//   res.render("documents/efile", {
//     title: "E-Filing Workspace",
//     matterId: req.params.matterId
//   });
// };

// exports.submitEfileReview = (req, res) => {
//   res.json({
//     success: true,
//     message: "E-File review saved (dummy)",
//     matterId: req.params.matterId
//   });
// };



//new code 

const pool = require("../db"); // pg pool

// ---------------- DOCUMENT CENTER ----------------

exports.listDocuments = async (req, res) => {
  const { rows } = await pool.query(`
    SELECT d.id, d.title, d.document_type, d.matter_id,
           MAX(v.version) AS latest_version
    FROM documents d
    LEFT JOIN document_versions v ON v.document_id = d.id
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `);

  res.render("documents/index", {
    title: "Document Center",
    documents: rows
  });
};

// ---------------- UPLOAD DOCUMENT (METADATA ONLY) ----------------

exports.uploadDocument = async (req, res) => {
  const { title, document_type, matter_id, tags } = req.body;

  const doc = await pool.query(
    `INSERT INTO documents (title, document_type, matter_id)
     VALUES ($1, $2, $3) RETURNING id`,
    [title, document_type, matter_id || null]
  );

  await pool.query(
    `INSERT INTO document_versions (document_id, version)
     VALUES ($1, 'v1')`,
    [doc.rows[0].id]
  );

  if (tags) {
    for (const tag of tags.split(",")) {
      await pool.query(
        `INSERT INTO document_tags (document_id, tag)
         VALUES ($1, $2)`,
        [doc.rows[0].id, tag.trim()]
      );
    }
  }

  res.json({ success: true });
};

// ---------------- CREATE NEW VERSION ----------------

exports.createVersion = async (req, res) => {
  const { documentId } = req.params;

  const last = await pool.query(
    `SELECT version FROM document_versions
     WHERE document_id=$1
     ORDER BY uploaded_at DESC LIMIT 1`,
    [documentId]
  );

  const nextVersion = `v${parseInt(last.rows[0].version.slice(1)) + 1}`;

  await pool.query(
    `INSERT INTO document_versions (document_id, version)
     VALUES ($1, $2)`,
    [documentId, nextVersion]
  );

  res.json({ success: true, version: nextVersion });
};

// ---------------- TEMPLATE CRUD ----------------

exports.listTemplates = async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM document_templates`);
  res.render("documents/templates", { title: "Templates", templates: rows });
};

exports.createTemplateForm = (req, res) => {
  res.render("documents/template-create", { title: "Create Template" });
};

exports.storeTemplate = async (req, res) => {
  const { name, category, content } = req.body;

  await pool.query(
    `INSERT INTO document_templates (name, category, content)
     VALUES ($1, $2, $3)`,
    [name, category, content]
  );

  res.redirect("/documents/templates");
};

// ---------------- E-FILE CHECKLIST ----------------

exports.submitEfileReview = async (req, res) => {
  const { matterId } = req.params;
  const checklist = req.body;

  await pool.query(
    `INSERT INTO efile_reviews (matter_id, checklist)
     VALUES ($1, $2)`,
    [matterId, checklist]
  );

  res.json({ success: true });
};
