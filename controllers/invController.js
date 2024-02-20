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
  });
};

invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("500 Error: Oh No! Something broke!");
  } catch (err) {
    next(err);
  }
};

module.exports = invCont;
