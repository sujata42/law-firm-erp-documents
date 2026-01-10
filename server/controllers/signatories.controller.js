const pool = require('../db');

exports.createSignatory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { signer_role, signer_name, mobile, email, method, remarks } = req.body;

    if (!signer_role || !signer_name) {
      return res.status(400).json({
        success: false,
        message: 'Signer role and name are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO document_signatories
       (document_id, signer_role, signer_name, mobile, email, method, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [documentId, signer_role, signer_name, mobile, email, method, remarks]
    );

    res.status(201).json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSignatories = async (req, res) => {
  const { documentId } = req.params;

  const result = await pool.query(
    'SELECT * FROM document_signatories WHERE document_id=$1',
    [documentId]
  );

  res.json({ success: true, data: result.rows });
};
