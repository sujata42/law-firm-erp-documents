// const pool = require('../db');

// exports.createOath = async (req, res) => {
//   const { caseId } = req.params;
//   const { oath_type, notes } = req.body;

//   const result = await pool.query(
//     `INSERT INTO oath_records (case_id, oath_type, file_url, notes)
//      VALUES ($1,$2,$3,$4)
//      RETURNING *`,
//     [caseId, oath_type, 'dummy-oath.pdf', notes]
//   );

//   res.status(201).json({ success: true, data: result.rows[0] });
// };


const pool = require('../db');

exports.createOath = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { oathType, oathNotes } = req.body;

    if (!oathType) {
      return res.status(400).json({
        success: false,
        message: 'oathType is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO oath_records 
       (case_id, oath_type, file_url, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        caseId,
        oathType,
        'dummy-oath.pdf', // as per task
        oathNotes || null
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Oath Error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
