// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const managementValidation = require("../utilities/management-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
);
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkAccountType,
  managementValidation.classificationRules(),
  managementValidation.checkClassificationData,
  utilities.handleErrors(invController.enterClassification)
);

router.post(
  "/add-inventory",
  utilities.checkAccountType,
  managementValidation.inventoryRules(),
  managementValidation.checkInventoryData,
  utilities.handleErrors(invController.enterInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  managementValidation.inventoryRules(),
  managementValidation.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

router.get(
  "/approve/",
  utilities.checkAccountTypeForApprovals,
  utilities.handleErrors(invController.approveInventoryView)
);

router.get(
  "/approve/:classification_id",
  utilities.checkAccountTypeForApprovals,
  utilities.handleErrors(invController.approveClassification)
);

router.get(
  "/approveInv/:inv_id",
  utilities.checkAccountTypeForApprovals,
  utilities.handleErrors(invController.approveInventory)
);

module.exports = router;
