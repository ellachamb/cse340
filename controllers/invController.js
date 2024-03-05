const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
const details = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  const content = utilities.buildDetails(data);
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    content,
    errors: null,
  });
};

invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("500 Error: Oh No! Something broke!");
  } catch (err) {
    next(err);
  }
};

invCont.buildManagement = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
};

invCont.buildAddClassification = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification Type",
    nav,
    errors: null,
  });
};

invCont.enterClassification = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const formResult = await invModel.enterClassification(classification_name);

  if (formResult) {
    req.flash(
      "notice",
      `You have added a new classification: ${classification_name}!`
    );
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification Type",
      nav,
    });
  }
};

invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const select = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    select,
    errors: null,
  });
};

invCont.enterInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
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

  const invResult = await invModel.enterInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (invResult) {
    req.flash("notice", `You have added a new inventory item!`);
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
    });
  }
};

module.exports = invCont;
