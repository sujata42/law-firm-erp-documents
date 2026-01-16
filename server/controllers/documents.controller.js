// //new code 

// const pool = require("../db"); // pg pool

// // ---------------- DOCUMENT CENTER ----------------

// exports.listDocuments = async (req, res) => {
//   const { rows } = await pool.query(`
//     SELECT d.id, d.title, d.document_type, d.matter_id,
//            MAX(v.version) AS latest_version
//     FROM documents d
//     LEFT JOIN document_versions v ON v.document_id = d.id
//     GROUP BY d.id
//     ORDER BY d.created_at DESC
//   `);

//   res.render("documents/index", {
//     title: "Document Center",
//     documents: rows
//   });
// };

// // ---------------- UPLOAD DOCUMENT (METADATA ONLY) ----------------

// exports.uploadDocument = async (req, res) => {
//   const { title, document_type, matter_id, tags } = req.body;

//   const doc = await pool.query(
//     `INSERT INTO documents (title, document_type, matter_id)
//      VALUES ($1, $2, $3) RETURNING id`,
//     [title, document_type, matter_id || null]
//   );

//   await pool.query(
//     `INSERT INTO document_versions (document_id, version)
//      VALUES ($1, 'v1')`,
//     [doc.rows[0].id]
//   );

//   if (tags) {
//     for (const tag of tags.split(",")) {
//       await pool.query(
//         `INSERT INTO document_tags (document_id, tag)
//          VALUES ($1, $2)`,
//         [doc.rows[0].id, tag.trim()]
//       );
//     }
//   }

//   res.json({ success: true });
// };

// // ---------------- CREATE NEW VERSION ----------------

// exports.createVersion = async (req, res) => {
//   const { documentId } = req.params;

//   const last = await pool.query(
//     `SELECT version FROM document_versions
//      WHERE document_id=$1
//      ORDER BY uploaded_at DESC LIMIT 1`,
//     [documentId]
//   );

//   const nextVersion = `v${parseInt(last.rows[0].version.slice(1)) + 1}`;

//   await pool.query(
//     `INSERT INTO document_versions (document_id, version)
//      VALUES ($1, $2)`,
//     [documentId, nextVersion]
//   );

//   res.json({ success: true, version: nextVersion });
// };

// // ---------------- TEMPLATE CRUD ----------------

// exports.listTemplates = async (req, res) => {
//   const { rows } = await pool.query(`SELECT * FROM document_templates`);
//   res.render("documents/templates", { title: "Templates", templates: rows });
// };

// exports.createTemplateForm = (req, res) => {
//   res.render("documents/template-create", { title: "Create Template" });
// };

// exports.storeTemplate = async (req, res) => {
//   const { name, category, content } = req.body;

//   await pool.query(
//     `INSERT INTO document_templates (name, category, content)
//      VALUES ($1, $2, $3)`,
//     [name, category, content]
//   );

//   res.redirect("/documents/templates");
// };

// // ---------------- E-FILE CHECKLIST ----------------

// exports.submitEfileReview = async (req, res) => {
//   const { matterId } = req.params;
//   const checklist = req.body;

//   await pool.query(
//     `INSERT INTO efile_reviews (matter_id, checklist)
//      VALUES ($1, $2)`,
//     [matterId, checklist]
//   );

//   res.json({ success: true });
// };


// new code according to task 
const pool = require("../db");

/*
|--------------------------------------------------------------------------
| DOCUMENT CENTER
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.id,
             d.title,
             d.document_type,
             d.matter_id,
             COALESCE(MAX(v.version), 'v1') AS latest_version,
             MAX(v.uploaded_at) AS updated_at
      FROM documents d
      LEFT JOIN document_versions v ON v.document_id = d.id
      GROUP BY d.id
      ORDER BY updated_at DESC NULLS LAST
    `);

    res.render("documents/index", {
      title: "Document Center",
      documents: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load documents");
  }
};

exports.createForm = (req, res) => {
  res.render("documents/create", {
    title: "Upload Document"
  });
};

exports.store = async (req, res) => {
  try {
    const { title, document_type, matter_id, tags } = req.body;

    const doc = await pool.query(
      `INSERT INTO documents (title, document_type, matter_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
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

    res.redirect("/documents");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to upload document");
  }
};

/*
|--------------------------------------------------------------------------
| DOCUMENT VERSIONS
|--------------------------------------------------------------------------
*/

exports.createVersion = async (req, res) => {
  try {
    const { documentId } = req.params;

    const last = await pool.query(
      `SELECT version
       FROM document_versions
       WHERE document_id = $1
       ORDER BY uploaded_at DESC
       LIMIT 1`,
      [documentId]
    );

    const current = last.rows[0]?.version || "v1";
    const nextVersion = `v${parseInt(current.replace("v", ""), 10) + 1}`;

    await pool.query(
      `INSERT INTO document_versions (document_id, version)
       VALUES ($1, $2)`,
      [documentId, nextVersion]
    );

    res.json({ success: true, version: nextVersion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/*
|--------------------------------------------------------------------------
| DOCUMENT TEMPLATES
|--------------------------------------------------------------------------
*/

exports.templates = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, category, created_at
       FROM document_templates
       ORDER BY created_at DESC`
    );

    res.render("documents/templates", {
      title: "Document Templates",
      templates: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load templates");
  }
};

exports.templateCreateForm = (req, res) => {
  res.render("documents/template-create", {
    title: "Create Template"
  });
};

exports.templateStore = async (req, res) => {
  try {
    const { name, category, content } = req.body;

    await pool.query(
      `INSERT INTO document_templates (name, category, content)
       VALUES ($1, $2, $3)`,
      [name, category, content]
    );

    res.redirect("/documents/templates");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save template");
  }
};

/*
|--------------------------------------------------------------------------
| FILING WORKSPACE
|--------------------------------------------------------------------------
*/

exports.filingWorkspace = (req, res) => {
  const { matterId } = req.params;

  res.render("documents/efile", {
    title: "Filing Workspace",
    matterId
  });
};

/*
|--------------------------------------------------------------------------
| FILING CHECKLIST
|--------------------------------------------------------------------------
*/

exports.saveChecklist = async (req, res) => {
  try {
    const { matterId } = req.params;
    const checklist = req.body;

    await pool.query(
      `INSERT INTO filing_checklist_items (matter_id, data)
       VALUES ($1, $2)
       ON CONFLICT (matter_id)
       DO UPDATE SET data = EXCLUDED.data`,
      [matterId, checklist]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
