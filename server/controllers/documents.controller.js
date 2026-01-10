const pool = require('../db'); // db/index.js

/**
 * POST /api/cases/:caseId/documents
 * Create document metadata (dummy file_url)
 */
exports.createDocument = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { doc_type, title } = req.body;

    // Basic validation
    if (!doc_type || !title) {
      return res.status(400).json({
        success: false,
        message: 'doc_type and title are required'
      });
    }

    const query = `
      INSERT INTO case_documents
      (case_id, doc_type, title, file_url, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      caseId,
      doc_type,
      title,
      'dummy-file.pdf', // UI-only for now
      'ACTIVE'
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create Document Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create document'
    });
  }
};

/**
 * GET /api/cases/:caseId/documents
 * Fetch all documents for a case
 */
exports.getDocuments = async (req, res) => {
  try {
    const { caseId } = req.params;

    const query = `
      SELECT *
      FROM case_documents
      WHERE case_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [caseId]);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });

  } catch (error) {
    console.error('Get Documents Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
};
