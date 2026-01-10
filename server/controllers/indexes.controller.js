// // const pool = require('../db');

// // exports.createIndex = async (req, res) => {
// //   try {
// //     const { documentId } = req.params;
// //     const { index_title, from_page, to_page } = req.body;

// //     if (!index_title || !from_page || !to_page) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'All fields are required'
// //       });
// //     }

// //     const result = await pool.query(
// //       `INSERT INTO document_indexes 
// //        (document_id, index_title, from_page, to_page)
// //        VALUES ($1, $2, $3, $4)
// //        RETURNING *`,
// //       [documentId, index_title, from_page, to_page]
// //     );

// //     res.status(201).json({
// //       success: true,
// //       data: result.rows[0]
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // };


// const pool = require('../db');

// // CREATE INDEX
// exports.createIndex = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const { index_title, from_page, to_page } = req.body;

//     if (!index_title || !from_page || !to_page) {
//       return res.status(400).json({
//         success: false,
//         message: 'index_title, from_page and to_page are required'
//       });
//     }

//     const result = await pool.query(
//       `INSERT INTO document_indexes 
//        (document_id, index_title, from_page, to_page)
//        VALUES ($1, $2, $3, $4)
//        RETURNING *`,
//       [documentId, index_title, from_page, to_page]
//     );

//     res.status(201).json({
//       success: true,
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };


// //new code 
// exports.getIndexes = async (req, res) => {
//   try {
//     const { documentId } = req.params;

//     const result = await pool.query(
//       `SELECT * FROM document_indexes
//        WHERE document_id = $1
//        ORDER BY from_page ASC`,
//       [documentId]
//     );

//     res.json({
//       success: true,
//       count: result.rows.length,
//       data: result.rows
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };



// // GET INDEXES
// exports.getIndexes = async (req, res) => {
//   try {
//     const { documentId } = req.params;

//     const result = await pool.query(
//       `SELECT * FROM document_indexes
//        WHERE document_id = $1
//        ORDER BY id ASC`,
//       [documentId]
//     );

//     res.json({
//       success: true,
//       count: result.rows.length,
//       data: result.rows
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };


const pool = require('../db');

// CREATE INDEX
exports.createIndex = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { index_title, from_page, to_page } = req.body;

    if (!index_title || !from_page || !to_page) {
      return res.status(400).json({
        success: false,
        message: 'index_title, from_page and to_page are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO document_indexes 
       (document_id, index_title, from_page, to_page)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [documentId, index_title, from_page, to_page]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create Index Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET INDEXES
exports.getIndexes = async (req, res) => {
  try {
    const { documentId } = req.params;

    const result = await pool.query(
      `SELECT * FROM document_indexes
       WHERE document_id = $1
       ORDER BY from_page ASC`,
      [documentId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get Indexes Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
