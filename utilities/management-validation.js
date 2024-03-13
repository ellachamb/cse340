const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha()
      .withMessage("Classification name must be alphabetical."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification Type",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Make with a minimum of 3 characters."), // on error this message is sent.

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a Model with a minimum of 3 characters."), // on error this message is sent.

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Please provide a valid year."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an thumbnail path."),

    body("inv_price")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please provide a price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please provide the miles."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the color"),

    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please provide a classification id."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const select = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory Item",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      select: select,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const select = await utilities.buildClassificationList();
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit Inventory Item",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
      classificationSelect: classificationSelect,
    });
    return;
  }
  next();
};

module.exports = validate;
