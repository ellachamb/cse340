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
router.get("", utilities.handleErrors(invController.buildManagement));
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

module.exports = router;
