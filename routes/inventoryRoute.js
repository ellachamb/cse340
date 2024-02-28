// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);
router.get("/trigger-error", invController.triggerError);
router.get("", invController.buildManagement);
router.get("/add-inventory", invController.buildAddInventory);
router.get("/add-classification", invController.buildAddClassification);

module.exports = router;
