# Law Firm ERP – Document Center & Filing Workspace Module

This repository contains the implementation of the **Document Center and Filing Workspace module** for a Law Firm ERP system, built as part of the assigned project work.

The module is designed to work for **India + global law firms** and supports document management, filing preparation, and structured workflows around legal matters.

---

## 📌 module scopes

### 1. Document Center
- Centralized repository for all documents
- Documents can exist independently of any matter
- Filters available:
  - Matter
  - Document Type
  - Uploaded By
  - Date Range
  - Tags (UI placeholder)
- Table columns:
  - Document Title
  - Linked Matter
  - Document Type
  - Version
  - Updated At
  - Actions (View / Versions / Link)

### 2. Document Templates
- List of reusable document templates
- Create new templates with:
  - Name
  - Category
  - Content (textarea for now)
- Merge fields support (UI-level):
  - `{{client_name}}`
  - `{{matter_title}}`
  - `{{court_name}}`
  - `{{filing_date}}`

### 3. Filing Workspace (`/documents/filing/:matterId`)
A structured workspace to prepare filing packages for a specific matter.

**Tabs included:**
- Upload Pleadings
- Merge Pack (order arrangement – UI)
- Indexing (index title + page range)
- Signatories (role + signing method placeholder)
- Oath (upload/record placeholder)
- Filing Review Checklist (must be completed before marking ready)

---

## 🧩 Widgets & Features Implemented
- Document Type dropdown:
  - Petition
  - Annexure
  - Affidavit
  - Vakalatnama
  - Evidence
  - Other
- Tags input (UI placeholder)
- Versioning concept (v1, v2, …)
- Link / unlink documents to a matter
- Checklist enforcement (cannot mark filing as ready unless all items are checked)

---

## 🗄️ Backend Overview

### Database Tables
- `documents`
- `document_versions`
- `document_tags`
- `document_templates`
- `filing_packs`
- `filing_checklist_items`

### APIs Implemented
- Document CRUD + version creation
- Template CRUD
- Filing pack creation and updates
- Checklist save  
  `POST /api/matters/:id/filing/checklist`

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- EJS (server-side rendering)
- PostgreSQL
- Bootstrap (Adminto template)

---

## ▶️ How to Run the Project

```bash
npm install
npm run dev
