const pool = require("../db");

/*
|--------------------------------------------------------------------------
| Ensure Filing Pack Exists
|--------------------------------------------------------------------------
*/
async function getOrCreatePack(matterId) {
  const existing = await pool.query(
    `SELECT id FROM filing_packs WHERE matter_id=$1`,
    [matterId]
  );

  if (existing.rows.length) return existing.rows[0].id;

  const created = await pool.query(
    `INSERT INTO filing_packs (matter_id)
     VALUES ($1) RETURNING id`,
    [matterId]
  );

  return created.rows[0].id;
}

/*
|--------------------------------------------------------------------------
| Merge Pack
|--------------------------------------------------------------------------
*/
exports.saveMergePack = async (req, res) => {
  const { matterId } = req.params;
  const { documents } = req.body; // [{document_id, order}]

  const packId = await getOrCreatePack(matterId);

  await pool.query(
    `DELETE FROM filing_pack_documents WHERE filing_pack_id=$1`,
    [packId]
  );

  for (const doc of documents) {
    await pool.query(
      `INSERT INTO filing_pack_documents
       (filing_pack_id, document_id, sort_order)
       VALUES ($1,$2,$3)`,
      [packId, doc.document_id, doc.order]
    );
  }

  res.json({ success: true });
};

/*
|--------------------------------------------------------------------------
| Indexing
|--------------------------------------------------------------------------
*/
exports.saveIndexing = async (req, res) => {
  const { matterId } = req.params;
  const { items } = req.body;

  const packId = await getOrCreatePack(matterId);

  await pool.query(
    `DELETE FROM filing_index_items WHERE filing_pack_id=$1`,
    [packId]
  );

  for (const i of items) {
    await pool.query(
      `INSERT INTO filing_index_items
       (filing_pack_id, title, page_from, page_to)
       VALUES ($1,$2,$3,$4)`,
      [packId, i.title, i.from, i.to]
    );
  }

  res.json({ success: true });
};

/*
|--------------------------------------------------------------------------
| Signatories
|--------------------------------------------------------------------------
*/
exports.saveSignatories = async (req, res) => {
  const { matterId } = req.params;
  const { signatories } = req.body;

  const packId = await getOrCreatePack(matterId);

  await pool.query(
    `DELETE FROM filing_signatories WHERE filing_pack_id=$1`,
    [packId]
  );

  for (const s of signatories) {
    await pool.query(
      `INSERT INTO filing_signatories
       (filing_pack_id, role, name, method)
       VALUES ($1,$2,$3,$4)`,
      [packId, s.role, s.name, s.method]
    );
  }

  res.json({ success: true });
};

/*
|--------------------------------------------------------------------------
| Oath
|--------------------------------------------------------------------------
*/
exports.saveOath = async (req, res) => {
  const { matterId } = req.params;
  const { oath_date, notes } = req.body;

  const packId = await getOrCreatePack(matterId);

  await pool.query(
    `DELETE FROM filing_oaths WHERE filing_pack_id=$1`,
    [packId]
  );

  await pool.query(
    `INSERT INTO filing_oaths (filing_pack_id, oath_date, notes)
     VALUES ($1,$2,$3)`,
    [packId, oath_date, notes]
  );

  res.json({ success: true });
};

/*
|--------------------------------------------------------------------------
| Checklist + Ready
|--------------------------------------------------------------------------
*/
exports.saveChecklist = async (req, res) => {
  const { matterId } = req.params;
  const checklist = req.body;

  await pool.query(
    `INSERT INTO filing_checklist_items (matter_id, data)
     VALUES ($1,$2)
     ON CONFLICT (matter_id)
     DO UPDATE SET data=$2, updated_at=NOW()`,
    [matterId, checklist]
  );

  if (Object.values(checklist).every(Boolean)) {
    await pool.query(
      `UPDATE filing_packs SET status='ready'
       WHERE matter_id=$1`,
      [matterId]
    );
  }

  res.json({ success: true });
};
