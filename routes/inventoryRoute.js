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
  utilities.handleErrors(invController.buildAddInventory)
);
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  managementValidation.classificationRules(),
  managementValidation.checkClassificationData,
  utilities.handleErrors(invController.enterClassification)
);

router.post(
  "/add-inventory",
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
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
