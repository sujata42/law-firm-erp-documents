const express = require("express");
const router = express.Router();

router.get("/cases/:id/pleadings", (req, res) => {
  res.render("pleadings/pleadings", {
    caseId: req.params.id,
    pageTitle: "Pleadings & Documents"
  });
});

module.exports = router;


//signers Table Management-------------------------------------------------------------------------------------------------
let signerCount = 1;

document.getElementById("addSigner").addEventListener("click", () => {
    const role = signerRole.value;
    const name = signerName.value;
    const contact = signerContact.value;
    const method = signMethod.value;

    if (!role || !name || !contact) {
        Swal.fire("Error", "All fields required", "error");
        return;
    }

    if (signerCount === 1) signerTable.innerHTML = "";

    signerTable.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${signerCount++}</td>
            <td>${role}</td>
            <td>${name}</td>
            <td>${contact}</td>
            <td><span class="badge bg-info">${method}</span></td>
        </tr>
    `);

    signerRole.value = signerName.value = signerContact.value = "";
});
