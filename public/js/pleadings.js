// console.log("pleadings.js loaded");

// /* ---------------- TAB SWITCHING (UNCHANGED) ---------------- */
// document.querySelectorAll("#pleadingTabs .nav-link").forEach(tab => {
//     tab.addEventListener("click", function () {
//         document.querySelectorAll("#pleadingTabs .nav-link")
//             .forEach(t => t.classList.remove("active"));

//         document.querySelectorAll(".tab-content")
//             .forEach(c => c.classList.add("d-none"));

//         this.classList.add("active");
//         document.getElementById(this.dataset.tab).classList.remove("d-none");
//     });
// });

// /* ---------------- DOCUMENTS (REAL API) ---------------- */

// async function loadDocuments() {
//     const res = await fetch(`/api/cases/${CASE_ID}/documents`);
//     const result = await res.json();

//     const table = document.getElementById("pleadingsTable");
//     table.innerHTML = "";

//     if (!result.data || result.data.length === 0) {
//         table.innerHTML = `<tr>
//             <td colspan="5" class="text-center text-muted">No pleadings added yet</td>
//         </tr>`;
//         return;
//     }

//     result.data.forEach((doc, i) => {
//         table.insertAdjacentHTML("beforeend", `
//             <tr data-doc-id="${doc.id}">
//                 <td>${i + 1}</td>
//                 <td>${doc.doc_type}</td>
//                 <td>${doc.title}</td>
//                 <td>${doc.version || "v1.0"}</td>
//                 <td><span class="badge bg-info">${doc.tag || "—"}</span></td>
//             </tr>
//         `);
//     });
// }

// document.getElementById("savePleading").addEventListener("click", async () => {
//     const docType = docTypeEl.value;
//     const title = titleEl.value;

//     if (!docType || !title) {
//         Swal.fire("Error", "Document Type and Title required", "error");
//         return;
//     }

//     const res = await fetch(`/api/cases/${CASE_ID}/documents`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ doc_type: docType, title })
//     });

//     const data = await res.json();

//     if (data.success) {
//         Swal.fire("Saved", "Document created", "success");
//         pleadingForm.reset();
//         loadDocuments();
//     } else {
//         Swal.fire("Error", data.message, "error");
//     }
// });

// loadDocuments();

// /* ---------------- INDEXING (REAL API) ---------------- */

// document.getElementById("addIndex").addEventListener("click", async () => {
//     const title = indexTitle.value;
//     const from = fromPage.value;
//     const to = toPage.value;

//     if (!title || !from || !to) {
//         Swal.fire("Error", "All fields required", "error");
//         return;
//     }

//     const docRow = document.querySelector("#pleadingsTable tr");
//     if (!docRow) {
//         Swal.fire("Error", "Create document first", "error");
//         return;
//     }

//     const documentId = docRow.dataset.docId;

//     const res = await fetch(`/api/documents/${documentId}/indexes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ index_title: title, from_page: from, to_page: to })
//     });

//     const data = await res.json();

//     if (data.success) {
//         Swal.fire("Added", "Index added", "success");
//         indexTable.insertAdjacentHTML("beforeend", `
//             <tr>
//                 <td>${indexTable.children.length + 1}</td>
//                 <td>${title}</td>
//                 <td>${from}</td>
//                 <td>${to}</td>
//             </tr>
//         `);
//         indexTitle.value = fromPage.value = toPage.value = "";
//     }
// });

// /* ---------------- SIGNATORIES (REAL API) ---------------- */

// document.getElementById("addSigner").addEventListener("click", async () => {
//     const role = signerRole.value;
//     const name = signerName.value;
//     const contact = signerContact.value;
//     const method = signMethod.value;

//     if (!role || !name) {
//         Swal.fire("Error", "Role and Name required", "error");
//         return;
//     }

//     const docRow = document.querySelector("#pleadingsTable tr");
//     if (!docRow) {
//         Swal.fire("Error", "Create document first", "error");
//         return;
//     }

//     const documentId = docRow.dataset.docId;

//     const res = await fetch(`/api/documents/${documentId}/signatories`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             signer_role: role,
//             signer_name: name,
//             mobile: contact,
//             method
//         })
//     });

//     const data = await res.json();

//     if (data.success) {
//         Swal.fire("Added", "Signer added", "success");
//         signerTable.insertAdjacentHTML("beforeend", `
//             <tr>
//                 <td>${signerTable.children.length + 1}</td>
//                 <td>${role}</td>
//                 <td>${name}</td>
//                 <td>${contact}</td>
//                 <td>${method}</td>
//             </tr>
//         `);
//         signerRole.value = signerName.value = signerContact.value = "";
//     }
// });

// /* ---------------- OATH (REAL API) ---------------- */

// document.getElementById("saveOath").addEventListener("click", async () => {
//     const type = oathType.value;
//     const notes = oathNotes.value;

//     if (!type) {
//         Swal.fire("Error", "Oath type required", "error");
//         return;
//     }

//     const res = await fetch(`/api/cases/${CASE_ID}/oath`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ oath_type: type, notes })
//     });

//     const data = await res.json();

//     if (data.success) {
//         Swal.fire("Saved", "Oath saved", "success");
//         oathTable.insertAdjacentHTML("beforeend", `
//             <tr>
//                 <td>${oathTable.children.length + 1}</td>
//                 <td>${type}</td>
//                 <td>${new Date().toLocaleDateString()}</td>
//                 <td>${notes || "—"}</td>
//             </tr>
//         `);
//         oathType.value = oathNotes.value = "";
//     }
// });



console.log("pleadings.js loaded");

/* ================== GLOBALS ================== */
const CASE_ID = window.CASE_ID || 1;

/* Cache DOM elements (THIS WAS MISSING) */
const pleadingForm = document.getElementById("pleadingForm");
const pleadingsTable = document.getElementById("pleadingsTable");

const docTypeEl = document.getElementById("docType");
const titleEl = document.getElementById("title");

const indexTitle = document.getElementById("indexTitle");
const fromPage = document.getElementById("fromPage");
const toPage = document.getElementById("toPage");
const indexTable = document.getElementById("indexTable");

const signerRole = document.getElementById("signerRole");
const signerName = document.getElementById("signerName");
const signerContact = document.getElementById("signerContact");
const signMethod = document.getElementById("signMethod");
const signerTable = document.getElementById("signerTable");

const oathType = document.getElementById("oathType");
const oathNotes = document.getElementById("oathNotes");
const oathTable = document.getElementById("oathTable");

/* ================== TAB SWITCHING ================== */
document.querySelectorAll("#pleadingTabs .nav-link").forEach(tab => {
  tab.addEventListener("click", function () {
    document.querySelectorAll("#pleadingTabs .nav-link")
      .forEach(t => t.classList.remove("active"));

    document.querySelectorAll(".tab-content")
      .forEach(c => c.classList.add("d-none"));

    this.classList.add("active");
    document.getElementById(this.dataset.tab).classList.remove("d-none");
  });
});

/* ================== DOCUMENTS ================== */
async function loadDocuments() {
  const res = await fetch(`/api/cases/${CASE_ID}/documents`);
  const result = await res.json();

  pleadingsTable.innerHTML = "";

  if (!result.data || result.data.length === 0) {
    pleadingsTable.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">No pleadings added yet</td>
      </tr>`;
    return;
  }

  result.data.forEach((doc, i) => {
    pleadingsTable.insertAdjacentHTML("beforeend", `
      <tr data-doc-id="${doc.id}">
        <td>${i + 1}</td>
        <td>${doc.doc_type}</td>
        <td>${doc.title}</td>
        <td>v1.0</td>
        <td><span class="badge bg-info">—</span></td>
      </tr>
    `);
  });
}

document.getElementById("savePleading").addEventListener("click", async () => {
//   const docType = docTypeEl.value;
//   const title = titleEl.value;

const docType = document.getElementById("docType").value;
const title = document.getElementById("title").value;

  if (!docType || !title) {
    Swal.fire("Error", "Document Type and Title required", "error");
    return;
  }

  const res = await fetch(`/api/cases/${CASE_ID}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_type: docType, title })
  });

  const data = await res.json();

  if (data.success) {
    Swal.fire("Saved", "Document created", "success");
    pleadingForm.reset();
    loadDocuments();
  } else {
    Swal.fire("Error", data.message, "error");
  }
});

loadDocuments();

/* ================== INDEXING ================== */
document.getElementById("addIndex").addEventListener("click", async () => {
  const title = indexTitle.value;
  const from = fromPage.value;
  const to = toPage.value;

  const docRow = pleadingsTable.querySelector("tr[data-doc-id]");
  if (!docRow) {
    Swal.fire("Error", "Create document first", "error");
    return;
  }

  const documentId = docRow.dataset.docId;

  const res = await fetch(`/api/documents/${documentId}/indexes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index_title: title, from_page: from, to_page: to })
  });

  const data = await res.json();

  if (data.success) {
    Swal.fire("Added", "Index added", "success");
    indexTable.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${indexTable.children.length + 1}</td>
        <td>${title}</td>
        <td>${from}</td>
        <td>${to}</td>
      </tr>
    `);
  }
});

/* ================== SIGNATORIES ================== */
document.getElementById("addSigner").addEventListener("click", async () => {
  const role = signerRole.value;
  const name = signerName.value;

  const docRow = pleadingsTable.querySelector("tr[data-doc-id]");
  if (!docRow) {
    Swal.fire("Error", "Create document first", "error");
    return;
  }

  const documentId = docRow.dataset.docId;

  const res = await fetch(`/api/documents/${documentId}/signatories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      signer_role: role,
      signer_name: name,
      mobile: signerContact.value,
      method: signMethod.value
    })
  });

  const data = await res.json();

  if (data.success) {
    Swal.fire("Added", "Signer added", "success");
    signerTable.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${signerTable.children.length + 1}</td>
        <td>${role}</td>
        <td>${name}</td>
        <td>${signerContact.value}</td>
        <td>${signMethod.value}</td>
      </tr>
    `);
  }
});

/* ================== OATH ================== */
document.getElementById("saveOath").addEventListener("click", async () => {
  const type = oathType.value;
  const notes = oathNotes.value;

  if (!type) {
    Swal.fire("Error", "Oath type required", "error");
    return;
  }

  const res = await fetch(`/api/cases/${CASE_ID}/oath`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oathType: type, oathNotes: notes })
  });

  const data = await res.json();

  if (data.success) {
    Swal.fire("Saved", "Oath saved", "success");
    oathTable.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${oathTable.children.length + 1}</td>
        <td>${type}</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>${notes || "—"}</td>
      </tr>
    `);
    oathType.value = oathNotes.value = "";
  }
});
